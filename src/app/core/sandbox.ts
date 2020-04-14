
import { IEventAggregator } from '@motorman/core/eventaggregator.interface';
import { Core } from '@motorman/vertices/core/core';
import { Reactive as CommonSandbox } from '@motorman/core/sandbox';
import { Sandbox as CommonComponentSandbox } from '@motorman/vertices/sandbox';
import { Utilities } from '@motorman/core/utilities';
import { Subject } from '@motorman/core/utilities/patterns/behavioral/observer';
import { Director, ActionHandlers, StateHandlers, channels } from './director';

// class Dependencies {};  // mock
// var director = new Director({ channels, Dependencies, ActionHandlers, StateHandlers });


class TemplateSubject extends Subject {
    private template: string = '';
    private repository: Node&DocumentFragment = new DocumentFragment();
    private digestion: Node&HTMLDivElement = document.createElement('div');
    public content: NodeList|Node[] = [ ];
    
    constructor(private sandbox: ElementSandboxState) {
        super('content');
        var { repository, digestion } = this;
        repository.appendChild(digestion);
    }
    
    set(template: string = '') {
        var { digestion } = this;
        
        digestion.innerHTML = template;
        this.template = template;
        this.observation = this.content = Array.prototype.slice.call(digestion.childNodes);
        
        return this;
    }
    
}

class MutationManager {
    protected observer: MutationObserver = new MutationObserver( (r, o) => this.observe(r, o) );
    protected get node(): Node { return this.sandbox.node; }
    protected get precepts(): any { return this.core.$nodes.get(this.node); }
    protected get selector(): string { return this.precepts.selector; }
    protected get instance(): string { return this.precepts.instance; }
    
    constructor(private sandbox: ElementSandboxState, public core: Core) {}
    
    private observe(changes: MutationRecord[], observer: MutationObserver) {
        for(let mutation of changes) this[mutation.type](mutation);
    }
    
    private ['childList'](mutation: MutationRecord) {
        var { sandbox, node } = this;
        console.log('MutationManager - childList', mutation);
    }
    private ['attributes'](mutation: MutationRecord) {
        var { sandbox, node, selector, instance } = this;
        var { attributeName: name, target: element } = mutation;
        var attr = (element as Element).getAttributeNode(name);
        var isIO = ( (element as Element).matches(selector) && node.isSameNode(element) )  // source of change occurred on host-element
          ;
        var detail = mutation
          , a = new CustomEvent('mutation', { detail })
          , e = new CustomEvent('mutation:attribute', { detail })
          , io = new CustomEvent('mutation:io', { detail })
          , i = new CustomEvent('mutation:input', { detail })
          , o = new CustomEvent('mutation:output', { detail })
          ;
        
        if (isIO) element.dispatchEvent(io);  // check instance to see if scope is already updated? if not, dispatch mutation:input event?
        attr.dispatchEvent(a);
        element.dispatchEvent(e);
    }
    private ['subtree'](mutation: MutationRecord) {
        var { sandbox, node } = this;
        console.log('MutationManager - subtree', mutation);
    }
    
    connect(config?: any) {
        var { observer, node } = this;
        var config = { attributes: true, childList: true, subtree: true, ...config };
        
        observer.observe(node, config);
        
        return this;
    }
    
    disconnect() {
        var { observer } = this;
        observer.disconnect();
        return this;
    }
    
}

class EventManager {
    private emit: (e: Event|CustomEvent) => any;
    private $events: Map<string, any> = new Map();
    get events(): string[] { return Array.from( this.$events.keys() ); }
    get node(): Node { return this.sandbox.node; }
    get proxy(): EventTarget { return EventTarget.prototype; }
    // get proxy(): EventTarget { return this.node; }
    get precepts(): any { return this.core.$nodes.get(this.node); }
    get instance(): any { return this.precepts.instance; }
    
    constructor(private sandbox: ElementSandboxState, public core: Core) {}
    
    private proxyEventTargetSource(source: EventTarget): boolean {
        var { node } = this;
        
        this.getEventTypes(<Element>node);
        this.events.forEach( (type) => node.addEventListener(type, this.handleAll, true) );
        
        return !!this.events.length;
    }
    
    /**
     * @param : source := EventTarget
     *  *   EventTarget.prototype
     *  *   Node (Element, Attr, etc)
     * @usage : [Node].addEventListener('*', ({ detail: e }) => {...}, false);
     */
    private proxyEventTargetSource_IDEAL(source: EventTarget) {
        var emit = source.dispatchEvent;  // obtain reference

        function proxy(e: Event|CustomEvent) {
            var { type } = e, any = new CustomEvent('*', { detail: e });  // use original event as detail
            if (!{ '*': true }[ type ]) emit.call(this, any);  // only emit "any" if type is not any.type ('*')
            return emit.call(this, e);
        }

        if ({ 'dispatchEvent': true }[ emit.name ]) source.dispatchEvent = proxy;  // attempt overwrite only if not already set (avoid rewrapping)
        this.emit = emit;

        return (source.dispatchEvent === proxy);  // indicate if its set after we try to
    }
    
    private getEventTypes(node: Node&Element): Node {
        if ( !{ [1]: true }[ node.nodeType ] ) return node;
        var { attributes, tagName } = node, re = /^\((.*)\)$/;
        
        for (let i = 0, len = attributes.length; i < len; i++) this.checkAttrNode(attributes[i], i, attributes);
        if (node.firstElementChild) this.getEventTypes(node.firstElementChild);
        if (node.nextElementSibling) this.getEventTypes(node.nextElementSibling);
        
        return node;
    }
    
    private checkAttrNode(attribute: Attr, i: number, attributes: NamedNodeMap) {
        var { name, value } = attribute, re = /^\((.*)\)$/;
        var match = re.test(name), matches = name.match(re), full, type;
        if (matches && matches.length) [ full, type ] = matches;
        if (matches && matches.length) this.$events.set(type, true);
    }
    
    connect() {
        var { node, proxy } = this;
        var successful = this.proxyEventTargetSource(proxy);
        
        node.addEventListener('*', this.handleAny, true);  // `useCapture`
        
        return this;
    }
    
    disconnect() {
        var { node, proxy } = this;
        
        node.removeEventListener('*', this.handleAll);
        proxy.dispatchEvent = this.emit;
        
        return this;
    }
    
    public handleAll = (e: Event|CustomEvent) => {
        var { type, target } = e, any = new CustomEvent('*', { detail: e });  // use original event as detail
        return target.dispatchEvent(any);
    };
    
    public handleAny = (any: CustomEvent) => {
        if ( !any.detail.target.attributes[`(${any.detail.type})`] ) return;
        var { instance } = this;
        var { detail: e } = any
          , { type, target } = <Event>e
          , property = `(${type})`
          , attr = (target as Element).attributes[property]
          , { name, value }: Attr = attr
          ;
        var re = /^(\w+)\((.*)\)$/
          , matches = value.match(re) || [ ]
          , [ full, action, params ] = matches
          ;
        var method = instance[action]
          , invoke = new Function('fn', 'ctx', '$event', `with (ctx) return fn.call(ctx, ${params})`)
          , result = invoke(method, instance, e)
          ;
        return result;
    };
    
}

interface ISandboxState extends IEventAggregator {
    // details: any;
    // core: any;
    // config: any;
    // director: Director;
    // target: any;
    // channels: any;
    // template: any;
}
interface INodeSandboxState extends ISandboxState {
}

class Sandbox implements ISandboxState {
    protected get core() { return this.details.core; }
    protected get target() { return this.details.target; }
    protected get config() { return this.core.configuration; }
    protected get director() { return this.config.director; }
    public content: Subject;
    
    constructor(protected details: { type, target: TPrecept, core: Core }) {}
    
    publish(channel: string, data?: any, ...more: any[]): ISandboxState {
        var { director } = this;
        director.publish(channel, data, ...more);
        return this;
    }
    subscribe(channel: string, handler: Function, ...more: any[]): ISandboxState {
        var { director } = this;
        director.subscribe(channel, handler, ...more);
        return this;
    }
    unsubscribe(channel: string, handler: Function, ...more: any[]): ISandboxState {
        var { director } = this;
        director.unsubscribe(channel, handler, ...more);
        return this;
    }
    
}

class ElementSandboxState extends Sandbox implements ISandboxState {
    private delegations: EventManager = new EventManager(this, this.core);
    private mutations: MutationManager = new MutationManager(this, this.core);
    public content: TemplateSubject = new TemplateSubject(this);
    public get channels() { return this.director.channels; }
    public get node(): Node&Element { return <Element>this.target; }
    
    constructor(node: Node&Element, core: Core) {
        super({ type: node.nodeType, target: node, core });
        this.content.attach(this);
        this.mutations.connect();
        // this.subscribe(this.channels['ELEMENT:MUTATION:ATTRIBUTE:OBSERVED'], (m) => console.log('ELEMENT:MUTATION:ATTRIBUTE:OBSERVED', m) );
        // this.node.addEventListener('OUTPUT', (e) => console.log('OUTPUT', e), false );
        // this.node.addEventListener('mutation:io', (e) => console.log('IO (io)', e), false);
        return this;
    }
    
    update(state: NamedNodeMap) {  // Chain of Responsibility Pattern
        var { mutations, delegations, node } = this;
        mutations.disconnect();  // reconnect after to avoid mutation events
        node.innerHTML = '';  // clear current contents
        for (let child of state) node.appendChild(child);
        mutations.connect();  // reconnect after to avoid mutation events
        delegations.connect();
    }
    
}


class AttributeSandboxState extends Sandbox implements ISandboxState {
    public get channels() { return this.director.channels; }
    public get node(): Node&Attr { return <Attr>this.target; }
    
    constructor(node: Node&Attr, core: Core) {
        super({ type: node.nodeType, target: node, core });
        return this;
    }
    
}


class TextSandboxState {}
class CommentSandboxState {}

class PipeSandboxState {}
class ServiceSandboxState implements ISandboxState {
    private get config() { return this.core.configuration; }
    private get director() { return this.config.director; }
    public get channels() { return this.director.channels; }
    
    constructor(private utils: Utilities, private core: Core) {
        return this;
    }
    
    publish(channel: string, data?: any, ...more: any[]): ISandboxState {
        var { director } = this;
        director.publish(channel, data, ...more);
        return this;
    }
    subscribe(channel: string, handler: Function): ISandboxState {
        var { director } = this;
        director.subscribe(channel, handler);
        return this;
    }
    unsubscribe(channel: string, handler: Function): ISandboxState {
        var { director } = this;
        director.unsubscribe(channel, handler);
        return this;
    }
    
}
class MicroserviceSandboxState {}
class IoTSandboxState {}

type TPipe = 'pipe';
type TService = 'service';
type TMicroService = 'microservice';
type TIoT = 'iot';
type TPreceptType = Node['ELEMENT_NODE'] | Node['ATTRIBUTE_NODE'] | Node['TEXT_NODE'] | Node['COMMENT_NODE'] | TPipe | TService | TMicroService | TIoT;
type TPrecept = (Node&Element) | (Node&Attr) | (Node&Text) | (Node&Comment) | Utilities;


function select(details: { type, target: TPrecept, core: Core }): any {
    var { type, target, core } = details;
    var Sandbox = {
        [Node.ELEMENT_NODE]: ElementSandboxState,
        [Node.ATTRIBUTE_NODE]: AttributeSandboxState,
        [Node.TEXT_NODE]: TextSandboxState,
        [Node.COMMENT_NODE]: CommentSandboxState,
        ['pipe']: PipeSandboxState,
        ['service']: ServiceSandboxState,
        ['microservice']: MicroserviceSandboxState,
        ['iot']: IoTSandboxState,
    }[ type ] as any;
    var sandbox = new Sandbox(target, core);
    
    return sandbox;
}


class SandboxContext extends Sandbox implements ISandboxState {
    public content: TemplateSubject;  // stub
    
    constructor(details: { type, target: TPrecept, core: Core }) {
        super(details);
        var sandbox = select(details);
        return sandbox;
    }
    
}

export {
    SandboxContext as Sandbox,
    ServiceSandboxState as ServiceSandbox,
    ElementSandboxState as ComponentSandbox,
};
