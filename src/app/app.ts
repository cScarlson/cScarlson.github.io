
import { filter } from 'rxjs/operators';
//
import { Environment } from '@motorman/models';
import { V, Element, Attribute, Service } from '@motorman/vertices';
import { Core } from '@motorman/vertices/core/core';
import { ChainOfResponsibility } from '@motorman/core/utilities/patterns/behavioral';
import { BackdropComponent } from '@motorman/vertices/sdk/components/backdrop/backdrop.component';
import { ModalComponent } from '@motorman/vertices/sdk/components/modal/modal.component';
import { Deferred } from '@motorman/core/utilities';
//
import { environment } from '../environments/environment';
import { Sandbox } from './core';
import { Director, ActionHandlers, StateHandlers, channels } from './core';
import { CONSTANTS, Utilities, bootstrap } from './core';
// import { AppComponent } from './app.component';


var app = new (class Application {
    
    constructor(env: Environment) {
        
        var utils = new Utilities();
        const {
            SELECTOR,
        } = CONSTANTS;
        
        type IMetadata = { type: string, selector: string, Class: any, Sandbox: typeof Sandbox };
        type IReferenceInstance = IMetadata & {
            target: Node | Utilities,
            instance: any,
            sandbox: Sandbox,
            occupants: Node[],
            occupee: Node,
            $occupants: Map<string, Node>,
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
                var data: IReferenceInstance = { target: utils, instance, selector, sandbox, occupants: null, occupee: null, $occupants: null, ...metadata };
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
            
            private processTextNode(node: Node&Text): Node&Text {  // Node.TEXT_NODE === 3
                if (!{ '3': true }[ node.nodeType ]) return node;  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
                // var { component} = this;
                // var { data } = node;
                // var interpolated = utils.interpolate(data)(component);
                
                // console.log('TEXT %O', node);
                // // node.replaceWith(interpolated);
                // // console.log('TEXT %O', node, data, interpolated);
                
                return node;
            }
            
            private processCommentNode(node: Node&Comment): Node&Comment {  // Node.COMMENT_NODE === 8
                if (!{ '8': true }[ node.nodeType ]) return node;  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
                // var attrs: NamedNodeMap = node.attributes;
                
                // console.log('COMMENT %O', node);
                // for (let i = 0, len = attrs.length; i < len; i++) this.parseChildAttr(attrs[i], i, attrs);
                // this.parse(node.childNodes);
                
                return node;
            }
            
            private processAttributeNode(node?: Node&Attr, ...more: (Node&Attr)[]): Node&Attr {
                if ( !node ) return node;
                if ( !{ [Node.ATTRIBUTE_NODE]: true }[ node.nodeType ] ) return node;
                if ( !this.modules.attribute.has(node.name) ) return this.processAttributeNode(...more);
                var { core, modules = {} } = this;
                var { $nodes, $instances } = core;
                var { attribute: $attributes = new Map() } = modules;
                var { nodeType, name } = node, metadata = $attributes.get(name);
                var { Sandbox, Class, selector }: IMetadata = metadata;
                var owner = this.getOwnerInstance(node);
                
                let sandbox = new Sandbox({ type: nodeType, target: node, core });  // must be constructed after node is emptied to avoid mutation events.
                let instance = new Class(sandbox);
                let data: IReferenceInstance = { node, instance, selector, sandbox, owner, ...metadata, occupants: null, occupee: null, $occupants: null };
                $nodes.set(node, data);
                $instances.set(instance, data);
                
                if ( !more.length ) return node;
                return this.processAttributeNode(...more);
            }
            private getOwnerInstance(node: Node&Attr, owner: Element = node.ownerElement): any {
                if ( !owner ) return null;
                if ( !this.core.$nodes.has(owner) ) return this.getOwnerInstance(null, owner.parentElement);
                var { core } = this;
                var { $nodes } = core, metadata = $nodes.get(owner);
                var { instance } = metadata;
                
                return instance;
            }
            
        }
        
        class Dependencies {};  // mock
        var director = new Director({ channels, Dependencies, ActionHandlers, StateHandlers });
        var config = {
            environment: document,
            director,
            Sandbox,
            bootstrap: new Bootstrap({}),
            // selector: `[data-${SELECTOR}]`,
            // datasets: '[data-attribute]',
            // decorators: { services: Sandbox, components: Sandbox },
        };
        
        @Service({}) class TestService {
            
            constructor(private $: any) {
                console.log(`@Service({ id: 'foreach' })`, $);
            }
            
        }
        
        @Attribute({ selector: 'foreach' }) class TemplateRepeatDirective {
            
            constructor(private $: any) {
                console.log(`@Attribute({ selector: 'foreach' })`, $);
            }
            
        }
        
        V(TestService);
        V(ModalComponent);
        V(TemplateRepeatDirective);
        alert(' | \n | Look at the comment below me! \n | \n V ');
        /*
            {   [Element]:   [ Element[] ]:    [selector]  }
               \            /\             \  /
                \ keyRefTo /  \  keyRefTo   \/ <-keyRefTo
            ...
            $selectors: Map<selector, Element[]>
            $types: Map<Element[], Element>
            $elements: Map<Element, selector>
            let selector = $a.get( b.get( c.get(x) ) )
            OR
            $selectors: Map<selector, LinkedList<Element>>
            ...
        */ 
        
        window.addEventListener( 'load', () => console.log('ON-LOAD?') );
        window.addEventListener( 'load', () => V.config(config) );
        
    }
    
})(environment);

export { app };
