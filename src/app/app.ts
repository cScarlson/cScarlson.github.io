
import { filter } from 'rxjs/operators';
//
import { Environment } from '@motorman/models';
import { V, Element } from '@motorman/vertices';
import { Core } from '@motorman/vertices/core/core';
import { ChainOfResponsibility } from '@motorman/core/utilities/patterns/behavioral';
// import { V, Element, attr, watch, bind, handle } from '@motorman/vertices';
import { BackdropComponent } from '@motorman/vertices/sdk/components/backdrop/backdrop.component';
import { ModalComponent } from '@motorman/vertices/sdk/components/modal/modal.component';
//
import { environment } from '../environments/environment';
import { ServiceSandbox, ComponentSandbox as Sandbox } from './core';
import { Director, ActionHandlers, StateHandlers, channels } from './core';
import { CONSTANTS, bootstrap } from './core';
import { Deferred } from '@motorman/core/utilities';
// import { AppComponent } from './app.component';


class TestService {
            
    constructor(private $: ServiceSandbox) {
        // console.log('@ TestService', $);
    }
    
    init() {
        // console.log('@ TestService # init', this.$);
        return this;
    }
    
}

@Element({ selector: 'v-custom', template: `<h2>This is a template for {name}</h2>` })
class Component {
    // @attr() name: any = '';
    // public id: number = +'998';
    
    // constructor(private $: Sandbox) {
    //     // console.log('@ v-custom', $.element, $.element.template);
    //     setTimeout( () => this.name = 'CLICK ME', (1000 * 3) );
    //     // $.attach(this);
    //     $.in($.channels['JOHN:WILL:LIKE:THIS:STRATEGY']).pipe(this.filterId).subscribe(this.handleId);
    //     // $.in($.channels['JOHN:WILL:LIKE:THIS:STRATEGY']).pipe(latest).subscribe(this.handleId);
    //     // setTimeout( () => $.attach(this), (1000 * 2) );
    // }
    
    // init(dataset: DOMStringMap) {
    //     console.log('@ Component # dataset', dataset);
    // }
    
    // attributeChangedCallback(attrName, oldVal, newVal) {
    //     console.log('@ Custom # attributeChangedCallback', attrName, oldVal, newVal);
    // }
    
    // @watch('name') watchName(val, old) {
    //     console.log(`@v-custom: this.name was ${old} and is now ${val}`);
    // }
    
    // @bind('click') handleClick(e: Event) {
    //     console.log('# click', e);
    //     this.name = 'now-this!!!';
    //     setTimeout( () => this.name = 'CLICK ME', (1000 * 3) );
    // }
    
    // next(e: CustomEvent) {
    //     var { type, detail } = e;
    //     var action = {
    //         [ this.$.channels['JOHN:WILL:LIKE:THIS:STRATEGY'] ]: this.handleId,
    //     }[ type ];
        
    //     console.log('@ next', type, detail);
    //     action && setTimeout( () => action.call(this, e), (1000 * 5) );
    // }
    // error(error: any) {
    //     // console.log('@ SomeComponent # error()', error);
    // }
    // complete() {
    //     // console.log('@ SomeComponent # complete()');
    // }
    
    // private filterId = filter( (e: CustomEvent) => e.detail.id === this.id );
    // private handleId = (e: CustomEvent) => {
    //     var { type, detail } = e;
    //     console.log('@ handleId', type, detail);
    // };
    
    // // public handleLatest = (e: CustomEvent) => {
    // //   var { type, detail } = e;
    // //   console.log('@ handleLatest', type, detail);
    // // };
    
}

@Element({ selector: 'v-other', template: `` })
class OtherComponent {
    
    // constructor(private $: Sandbox) {
    //     setTimeout( () => this.wait(), (1000 * 3) );
    //     setTimeout( () => $.publish($.channels['MODAL:REQUESTED'], { active: '???' }), (1000 * 2) );
    // }
    
    // wait() {
    //     var { $ } = this;
    //     $.publish($.channels['JOHN:WILL:LIKE:THIS:STRATEGY'], { id: 998, datum: 'A' });
    //     $.publish($.channels['JOHN:WILL:LIKE:THIS:STRATEGY'], { id: 999, datum: 'B' });
    // }
    
}

var app = new (class Application {
    
    constructor(env: Environment) {
    
        const {
            SELECTOR,
        } = CONSTANTS;
        
        type IMetadata = { type: string, selector: string, Class: any, Sandbox: typeof Sandbox };
        type IReferenceInstance = IMetadata & {
            node: Node,
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
                var { service: $services } = modules;
                // set instances on core? or core.configuration.director?
                return env;
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
                var { childNodes } = node;
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
                let sandbox = new Sandbox(node, core);  // must be constructed after node is emptied to avoid mutation events.
                let instance = new Class(sandbox);
                let data: IReferenceInstance = { node, instance, selector, sandbox, occupants, occupee, $occupants, ...metadata };
                occupants.forEach( c => addOccupant($occupants, occupee, c) );
                
                $nodes.set(node, data);  // TODO: there may me a better way to align domnodes with other data using same index
                $instances.set(instance, data);
            }
            
            private processElementNode(node: Node&Element): Node&Element {  // Node.ELEMENT_NODE === 1
                if (!{ '1': true }[ node.nodeType ]) return node;  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
                var { modules = {} } = this;
                var { element: $elements = new Map(), attribute: $attributes = new Map() } = modules;
                
                for (let [key, val] of $elements) this.processMetadata(node, val, key, $elements);
                
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
            // decorators: { services: ServiceSandbox, components: Sandbox },
        };
        
        V(ModalComponent);
        
        window.addEventListener( 'load', () => console.log('ON-LOAD?') );
        window.addEventListener( 'load', () => V.config(config) );
        
    }
    
})(environment);

export { app };
