
import { Core, Sandbox } from '@motorman/vertices/core';
import { ChainOfResponsibility } from '@motorman/core/utilities/patterns/behavioral';
import { Utilities, Deferred } from '@motorman/core/utilities';

var utils = new Utilities();

type IMetadata = { type: string, selector: string, Class: any, Sandbox: typeof Sandbox };
type IReferenceInstance = IMetadata & {
    target: Node | Utilities,
    instance: any,
    sandbox: Sandbox,
    owner?: any,
    occupants?: Node[],
    occupee?: Node,
    $occupants?: Map<string, Node>,
};

class Bootstrap {
    private core: Core = null;  // assume !null if pEnvironment.[[status]] !== pending
    public dEnvironment: Deferred<any> = new Deferred();  // resolver must set this.core before invoking resolve()
    public pEnvironment: Promise<any> = this.dEnvironment.promise;
    get modules() { if (this.core) return this.core.modules; else return null; }
    protected pipeNodeHandler = (handler: Function) => (e: CustomEvent) => handler.call(this, e.detail, e);
    protected nodeProcessors: ChainOfResponsibility = new ChainOfResponsibility({}, [
        { respond: this.pipeNodeHandler(this.processElementNode) },
        { respond: this.pipeNodeHandler(this.processTextNode) },
        { respond: this.pipeNodeHandler(this.processCommentNode) },
    ]);
    
    constructor(options: any = {}) {
        var { pEnvironment } = this;
        
        pEnvironment
            // .then( (env) => this.bootstrapDirector(env) )
            .then( (env) => this.bootstrapServices(env) )
            .then( (env) => this.parseNode(env) )
            ;
        return this;
    }
    
    execute(core: Core): Node&Document {
        var { configuration } = core;
        var { environment } = configuration;
        
        this.core = core;
        this.dEnvironment.resolve(environment);
        
        return environment;
    }
    
    bootstrapServices(env: Document): Node&Document {
        var { core } = this;
        var { modules } = core;
        var { service: $services = new Map() } = modules;
        
        for (let [key, val] of $services) this.bootstrapService(val, key, $services);
        
        return env;
    }
    bootstrapService(metadata: IMetadata, key: string, $services: Map<string, IMetadata>) {
        var { core } = this;
        var { $instances } = core;
        var { Sandbox, Class, selector } = metadata;
        var sandbox = new Sandbox({ type: 'service', target: utils, core });
        var instance = new Class(sandbox);
        var data: IReferenceInstance = { target: utils, instance, selector, sandbox, ...metadata };
    }
    
    parseNode(node: Node): Node {
        var { nodeProcessors: cor } = this;
        var e = new CustomEvent('domnodeprocess', { detail: <any>node })
            , e = cor.respond(e)
            , { detail: result } = e
            ;
        var { isConnected, parentNode: parent, previousSibling: previous, nextSibling: next, firstChild: child } = result;
        
        // RECURSION
        // if (result !== node) return this.parseNode(result);  // reparse. assume replacement occurred. do not continue for next or child.
        if (child) this.parseNode(child);  // TCO???
        if (next) this.parseNode(next);  // TCO???
        return node;  // result can still equal node
    }
        
    private processMetadata(node: Node&Element, metadata: IMetadata, selector: string, $elements: Map<string, IMetadata>) {
        if ( !node.matches(selector) ) return;
        var { core } = this;
        var { $instances, $nodes } = core;
        var { Class, Sandbox } = metadata;
        var { nodeType, childNodes } = node;
        var occupants = Array.prototype.slice.call(childNodes);
        var occupee = new DocumentFragment();
        var $occupants = new Map();
        
        function addOccupant($occupants: Map<string, Node[]>, occupee: DocumentFragment, node: Node&HTMLSlotElement) {
            var { slot: name = '' } = node;
            if ( !$occupants.has(name) ) $occupants.set(name, [ ]);
            $occupants.get(name).push(node);
            occupee.appendChild(node);
        }
        
        while (node.lastChild) node.firstChild.remove();  // clear from original parent to obviate child.cloneNode and maintain same object in Heap
        let sandbox = new Sandbox({ type: nodeType, target: node, core });  // must be constructed after node is emptied to avoid mutation events.
        let instance = new Class(sandbox);
        let data: IReferenceInstance = { target: node, instance, selector, sandbox, occupants, occupee, $occupants, ...metadata };
        occupants.forEach( c => addOccupant($occupants, occupee, c) );
        
        $nodes.set(node, data);
        $instances.set(instance, data);
    }
    
    private processElementNode(node: Node&Element): Node&Element {  // Node.ELEMENT_NODE === 1
        if ( !{ '1': true }[ node.nodeType ] ) return node;  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
        var { modules = {} } = this;
        var { element: $elements = new Map() } = modules;
        var { attributes } = node;
        var attribute = attributes[0];
        
        for (let [key, val] of $elements) this.processMetadata(node, val, key, $elements);
        if (attribute) this.processAttributeNode(attribute, ...node.attributes);
        
        return node;
    }
    
    private processAttributeNode(node?: Node&Attr, ...more: (Node&Attr)[]): Node&Attr {
        if ( !node ) return node;
        if ( !{ [Node.ATTRIBUTE_NODE]: true }[ node.nodeType ] ) return node;
        if ( !this.modules.attribute ) return node;
        if ( !this.modules.attribute.has(node.name) ) return this.processAttributeNode(...more);
        var { core, modules = {} } = this;
        var { $nodes, $instances } = core;
        var { attribute: $attributes = new Map() } = modules;
        var { nodeType, name } = node, metadata = $attributes.get(name);
        var { Sandbox, Class, selector }: IMetadata = metadata;
        var owner = this.getOwnerInstance(node.ownerElement);
        
        let sandbox = new Sandbox({ type: nodeType, target: node, core });  // must be constructed after node is emptied to avoid mutation events.
        let instance = new Class(sandbox);
        let data: IReferenceInstance = { target: node, instance, selector, sandbox, owner, ...metadata };
        $nodes.set(node, data);
        $instances.set(instance, data);
        
        if ( !more.length ) return node;
        return this.processAttributeNode(...more);
    }
    
    private processTextNode(node: Node&Text): Node&Text {  // Node.TEXT_NODE === 3
        if (!{ '3': true }[ node.nodeType ]) return node;  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
        if ( !this.modules.text ) return node;
        var { modules } = this;
        var { text: $texts }: { text: Map<RegExp, IMetadata> } = modules;
        
        for (let [key, val] of $texts) this.initializeInstance(node, val, key, $texts);
        
        return node;
    }
    
    private processCommentNode(node: Node&Comment): Node&Comment {  // Node.COMMENT_NODE === 8
        if (!{ '8': true }[ node.nodeType ]) return node;  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
        if ( !this.modules.comment ) return node;
        var { modules } = this;
        var { comment: $comments }: { comment: Map<RegExp, IMetadata> } = modules;
        
        for (let [key, val] of $comments) this.initializeInstance(node, val, key, $comments);
        
        return node;
    }
    
    private initializeInstance(node: Node&(Text|Comment), metadata: IMetadata, key: RegExp, $text: Map<RegExp, IMetadata>) {
        var { core } = this;
        var { $instances, $nodes } = core;
        var { nodeType, nodeValue } = node;
        var { Sandbox, Class, selector } = metadata;
        
        if ( !key.test(nodeValue) && !{ '#text': true }[ selector ] ) return;
        let owner = this.getOwnerInstance(node.parentElement);
        let sandbox = new Sandbox({ type: nodeType, target: node, core });
        let instance = new Class(sandbox);
        let data: IReferenceInstance = { target: node, instance, selector, sandbox, owner, ...metadata };
        
        $instances.set(instance, data);
        $nodes.set(node, data);
    }
    
    private getOwnerInstance(node: Node&Element): any {
        if ( !this.core.$nodes.has(node) ) return this.getOwnerInstance(node.parentElement);
        var { core } = this;
        var { $nodes } = core, metadata = $nodes.get(node);
        var { instance } = metadata;
        
        return instance;
    }
    
}

export { Bootstrap };