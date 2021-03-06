
import { Sandbox as CommonSandbox } from '@motorman/core';
import { Core, } from '@motorman/vertices/core/core';
import { Utilities } from '@motorman/core/utilities';
import { Queue, Stack } from '@motorman/core/utilities/ds';
import { Subject } from '@motorman/core/utilities/patterns/behavioral/observer';
import { ISandbox } from './sandbox.interface';


type TElement = 'element';
type TAttribute = 'attribute';
type TText = 'text';
type TComment = 'comment';
type TPipe = 'pipe';
type TService = 'service';
type TMicroService = 'microservice';
type TIoT = 'iot';
type TPrecept = (Node&Element) | (Node&Attr) | (Node&Text) | (Node&Comment) | Utilities;


class TemplateSubject extends Subject {
    private repository: Node&DocumentFragment = new DocumentFragment();
    private digestion: Node&HTMLDivElement = document.createElement('div');
    public template: string = '';
    public content: NodeList|Node[] = [ ];
    public events: string[] = [ ];
    
    constructor(private sandbox: ElementSandboxState, private core: Core) {
        super('content');
        var { repository, digestion } = this;
        repository.appendChild(digestion);
    }
    
    protected encodePropertyTokens(template: string): string {
        return template.replace(/\{([^{}]+)\}="(.*)"/img, function replace(whole, $1, $2) {
            var codes = $1.split(''), codes = codes.map( c => c.charCodeAt(0) ), codes = codes.join('#');
            return `{${codes}}="${$2}"`;
        });
    }
    
    protected collectEventTypes(template: string): string {
        var re = /\(([^()]+)\)=/img;
        var matches = (template.match(re) || []).map( match => match.replace(re, '$1') );
        this.events.length = 0;
        this.events.push(...matches);
        return template;
    }
    
    /**
     * @intention
     *      Sets template and triggers update on all observers. This allows components to set a template from any source:
     *          * import template from './x.component.html'; subject.set(template);  // compiletime
     *          * http.get('template.html').then( (html) => subject.set(html) );  // runtime AJAX
     *          * subject.set(Sandbox.data.occupee.innerHTML);  // runtime provided (slotless)
     *          * subject.set(Sandbox.data.occupee.querySelector('template').content);  // runtime provided (slot)
     *          * subject.set( utils.interpolate(template)(this) );  // runtime any interpolated
     *      
     */
    set(template: string = '') {
        var { sandbox, digestion } = this;
        var { state } = sandbox;
        var html = this.collectEventTypes(template)
          , html = this.encodePropertyTokens(template)
          , html = sandbox.utils.interpolate(html)(state.data)
          ;
        
        digestion.innerHTML = html;
        this.template = template;
        this.observation = this.content = Array.prototype.slice.call(digestion.childNodes);
        
        return this;
    }
    
}
class StateSubject extends Subject {
    public states: Stack<any> = new Stack([]);
    public get data(): any { return this.states.peek(); };
    
    constructor(private sandbox: ElementSandboxState, private core: Core) {
        super('data');
    }
    
    set(state: any = {}) {
        this.states.push(state);
        this.notify();
        return this;
    }
    
}

class MutationManager {  // https://developer.mozilla.org/pt-BR/docs/Web/API/MutationObserver
    protected observer: MutationObserver = new MutationObserver( (r, o) => this.observe(r, o) );
    protected bootstrap: any = this.core.configuration.bootstrap;
    protected get node(): Node { return this.sandbox.target; }
    protected get data(): any { return this.sandbox.data; }
    protected get selector(): string { return this.data.selector; }
    protected get instance(): string { return this.data.instance; }
    
    constructor(private sandbox: ElementSandboxState, private core: Core) {}
    
    private observe(changes: MutationRecord[], observer: MutationObserver) {
        for(let mutation of changes) this[mutation.type](mutation);
    }
    
    private trigger(type: string, mutation: MutationRecord) {
        var { target, addedNodes, removedNodes } = mutation;
        var nodes = { 'children:added': addedNodes, 'children:removed': removedNodes }[ type ];
        var detail = { mutation, nodes };
        var e = new CustomEvent(type, { detail });
        
        target.dispatchEvent(e);
        for (let i = 0, len = nodes.length; i < len; i++) trigger(target, type, mutation, nodes[i]);
        
        function trigger(target: Node, type: string, mutation: MutationRecord, node: Node) {
            var detail = { mutation, node, target };
            var tChild = { 'children:added': 'node:added', 'children:removed': 'node:removed' }[ type ];
            var tParent = { 'children:added': 'child:added', 'children:removed': 'child:removed' }[ type ];
            var c = new CustomEvent(tChild, { detail });
            var p = new CustomEvent(tParent, { detail });
            
            node.dispatchEvent(c);
            target.dispatchEvent(p);
        }
        
        return this;
    }
    
    private ['childList'](mutation: MutationRecord) {
        var { sandbox, node, bootstrap } = this;
        var detail = { mutation }
          , e = new CustomEvent('mutation:children', { detail })
          ;
        this.trigger('children:added', mutation);
        this.trigger('children:removed', mutation);
        if (mutation.addedNodes.length) bootstrap.parseNode( mutation.addedNodes[0] );  // ISSUE: sometimes triggers recursive bootstrap.parseNode() up parentElement chain
    }
    private ['attributes'](mutation: MutationRecord) {
        var { sandbox, node, selector, instance } = this;
        var { attributeName: name, target: element }: any&{ target: HTMLElement } = mutation;
        var attr = element.getAttributeNode(name);
        var detail = { mutation, node: attr, operation: 'update' }
          , a = new CustomEvent('mutation', { detail })
          , e = new CustomEvent('mutation:attribute', { detail })
          ;
        if ( !element.hasAttribute(name) ) detail.operation = 'delete';
        if ( { 'null': true, 'undefined': true, '': true }[ mutation.oldValue ] ) detail.operation = 'create';
        
        element.dispatchEvent(e);
        if ( { 'delete': true }[ detail.operation ]) element.dispatchEvent( new CustomEvent('node:removed', { detail }) );
        if (!{ 'delete': true }[ detail.operation ]) attr.dispatchEvent(a);
    }
    private ['characterData'](mutation: MutationRecord) {
        var { sandbox, node } = this;
        // console.log('MutationManager - characterData', mutation);
    }
    private ['subtree'](mutation: MutationRecord) {
        var { sandbox, node } = this;
        // console.log('MutationManager - subtree', mutation);
    }
    
    connect(config?: any) {
        var { observer, node } = this;
        var config = {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true,
            attributeOldValue: true,
            characterDataOldValue: true,
            // attributeFilter: true,
            ...config
        };
        
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
    set events(value: string[]) { this.$events.clear(); value.forEach( type => this.$events.set(type, type) ); }
    get node(): Node { return this.sandbox.target; }
    get proxy(): EventTarget { return EventTarget.prototype; }
    // get proxy(): EventTarget { return this.node; }
    get data(): any { return this.sandbox.data; }
    get instance(): any { return this.data.instance; }
    
    constructor(private sandbox: ElementSandboxState, private core: Core) {}
    
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
    
    connect(events: string[]) {
        var { node, proxy } = this;
        
        this.events = events;
        // this.events.forEach( (type) => node.addEventListener(type, this.handleAll, true) );
        this.events.forEach( (type) => node.addEventListener(type, this.handleAll, true) );  // enforce `useCapture` to handle other events such as <img>.error (disallows bubble).
        node.addEventListener('*', this.handleAny, true);  // `useCapture`
        
        return this;
    }
    
    disconnect() {
        var { node, proxy } = this;
        
        node.removeEventListener('*', this.handleAll);
        proxy.dispatchEvent = this.emit;
        
        return this;
    }
    
    private handleAll = (e: Event|CustomEvent) => {
        // console.log( 'ALWAYS', e.bubbles, (e.currentTarget as Element).tagName, (e.target as Element).tagName, e.type, (e.target as Element).isSameNode(this.node) );
        var { node } = this;
        var { parentElement: parent } = node;
        var { type, target, bubbles }: any&{ target: Element } = e;
        var any = new CustomEvent('*', { bubbles: true, detail: e }), recursive = new Event(type, { bubbles: true });  // manually bubble
        
        // if ( !target.isSameNode(node) ) node.dispatchEvent(recursive);
        if (node !== document) parent.dispatchEvent(recursive);  // retrigger event on parent to ensure Event Delegation. otherwise, parents with same handler will not be reached. use parent.isSameNode to prevent (type)="..." from host being invoked
        node.dispatchEvent(any);
        
        return true;  // always allow bubbling
    };
    
    public handleAny = (any: CustomEvent<{ type: string, target: Element, e: Event }>) => {
        if ( !any.detail.target.attributes[`(${any.detail.type})`] ) return true;
        var { node, instance } = this;
        var { detail: e } = any
          , { type, target, currentTarget }: any&{ target: Element } = e
          , property = `(${type})`
          , attr = target.attributes[property]
          , { name, value }: Attr = attr
          ;
        var re = /^(.+)\((.*)\)$/
          , matches = value.match(re) || [ ]
          , [ full, action, params ] = matches
          ;
        var has = ( new Function('ctx', `with (ctx) return !!ctx.${action}`) )(instance)
          , invoke = new Function('ctx', '$event', `with (ctx) return ${value}`)
          , result = true;
          ;
        
        if (has) result = invoke(instance, e);
        return result;
    };
    
}

class Sandbox extends CommonSandbox implements ISandbox {
    protected get core() { return this.details.core; }
    public data: any = this.details.data;
    public target: any = this.details.target;
    public bootstrap: any = this.core.configuration.bootstrap;
    
    constructor(protected details: { type: string, target: any, data: any, core: Core }) {  // TODO: make first argument always target
        super(details.core.configuration.director);
    }
    
    init(data: any = {}): Sandbox {
        // ~this.data~ this.config (change key name)
        // this.data = data;
        return this;
    }
    
}

class NodeSandbox extends Sandbox {
    
    constructor(details: { type: string, target: Element|Attr|Text|Comment, data: any, core: Core }) {
        super(details);
    }
    
    protected handleNodeRemoved(e: CustomEvent) {
        console.warn('TODO (SUPER): core.stop(e.target).destroy(e.target)', e);
    }
    
}



class ElementProxy {
    
    constructor(private sandbox: Sandbox, private target: Element, private core: Core) {}
    
    get(target: Element, key: string|number|symbol, receiver: ElementProxy): any {
        var result: any = Reflect.get(target, key, receiver);
        return result;
    }
    
}

class NamedNodeMapProxy {
    
    constructor(private sandbox: Sandbox, private target: NamedNodeMap, private core: Core) {}
    
    get(target: NamedNodeMap, key: string|number|symbol, receiver: NamedNodeMapProxy): Attr {
        var attr: Attr = Reflect.get(target, key, receiver);
        var handler: AttributeProxy = new AttributeProxy(this.sandbox, attr, this.core);
        var result: Attr = new Proxy(attr, handler);
        
        return result;
    }
    
}

class AttributeProxy implements ProxyHandler<Attr> {
    
    constructor(private sandbox: Sandbox, private target: Attr, private core: Core) {}
    
    get(target: Attr, key: string|number|symbol, receiver: AttributeProxy): any {
        var result: any = Reflect.get(target, key, receiver);
        return result;
    }
    
    set(target: Attr, key: string|number|symbol, value: any, receiver: AttributeProxy): any {
        var current = target[key];
        var result: any = Reflect.set(target, key, value, receiver);
        var changed = (current !== result);
        if ({ value: true, nodeValue: true }[ key ] && changed) this.trigger('changed', { oldValue: current });
        
        return result;
    }
    
    deleteProperty(target: Attr, key: string|number|symbol): any {
        var current = target[key];
        var result: any = Reflect.deleteProperty(target, key);
        var changed = (current !== result);
        if ({ value: true, nodeValue: true }[ key ] && changed) this.trigger('deleted', { oldValue: current });
        
        return result;
    }
    
    trigger(trigger: string, data: { oldValue: any, newValue?: any }) {
        var { target } = this;
        var { name, value, ownerElement } = target;
        var operation = { 'changed': 'change', 'deleted': 'delete' }[ trigger ];
        var type = { 'changed': 'attribute:changed', 'deleted': 'attribute:deleted' }[ trigger ];
        var spec = `${name}:${trigger}`;
        var detail = { ...data, target, ownerElement, name, value, old: data.oldValue, operation };
        var t = new CustomEvent(type, { detail });  // example: ('attribute:changed', detail: {...})
        var m = new CustomEvent(spec, { detail });  // example: ('active:changed', detail: { ..., name: 'active', value: 'true', oldValue: 'false', ..., })
        
        ownerElement.dispatchEvent(t);  // dispatch generic
        ownerElement.dispatchEvent(m);  // dispatch specific
        
        return this;
    }
    
}

class ElementSandboxState extends NodeSandbox implements ISandbox {
    protected delegations: EventManager = new EventManager(this, this.core);
    protected mutations: MutationManager = new MutationManager(this, this.core);
    public content: TemplateSubject = new TemplateSubject(this, this.core);
    public state: StateSubject = new StateSubject(this, this.core);
    public node: Element = this.target;
    public element: Element = new Proxy( this.target, new ElementProxy(this, this.target, this.core) );
    public attributes: NamedNodeMap = this.target.attributes;
    public attrs: NamedNodeMap = new Proxy( this.attributes, new NamedNodeMapProxy(this, this.target.attributes, this.core) );
    public $classes: DOMTokenList = this.target.classList;
    public $dataset: DOMStringMap = (this.target as HTMLElement).dataset;
    
    constructor(details: { type: 'element', target: Element, data: any, core: Core }) {
        super(details);
        var { target, data } = details;
        
        this.content.attach({ update: (state) => this.handleTemplateUpdate(state) });  // TODO: detatch is broken. use Command Pattern.
        this.state.attach({ update: (state) => this.handleStateUpdate(state) });  // TODO: detatch is broken. use Command Pattern.
        this.mutations.connect();
        target.addEventListener('node:removed', this.handleNodeRemoved, false);
        target.addEventListener('children:removed', this.handleChildrenRemoved, false);
        target.addEventListener('child:removed', this.handleChildRemoved, false);
        
        return this;
    }
    
    v(root: Node): Node {
        var { bootstrap } = this;
        var result = bootstrap.parseNode(root);
        return result;
    }
    
    handleStateUpdate(state: any) {
        this.content.set(this.content.template);  // trigger full template reparse
    }
    
    handleTemplateUpdate(state: NamedNodeMap) {  // Chain of Responsibility Pattern
        var { content, mutations, delegations, target } = this;
        
        delegations.connect(content.events);  // listen for all events before children begin to load
        mutations.disconnect();  // reconnect after to avoid mutation events
        (target as Element).innerHTML = '';  // clear current contents
        for (let child of state) (target as Element).appendChild(child);
        mutations.connect();  // reconnect after to avoid mutation events
    }
    
    protected handleNodeRemoved = (e: CustomEvent) => {
        console.warn('TODO (ELEMENT): handle target+instance destroy', e);
        super.handleNodeRemoved(e);
    }
    
    protected handleChildrenRemoved = (e: CustomEvent) => {}
    
    protected handleChildRemoved = (e: CustomEvent) => {}
    
}

class AttributeSandboxState extends NodeSandbox implements ISandbox {
    public node: Attr = this.target;
    public attribute: Attr = new Proxy( this.target, new AttributeProxy(this, this.target, this.core) );
    public element: Element = this.target.ownerElement;
    public owner: any = this.data.owner;
    
    constructor(details: { type: 'attribute', target: Node&Attr, data: any, core: Core }) {
        super(details);
        var { target } = details;
        target.ownerElement.addEventListener('node:removed', this.handleNodeRemoved, false);
        return this;
    }
    
    protected handleNodeRemoved = (e: CustomEvent) => {
        console.warn('TODO (ATTRIBUTE): handle target+instance destroy', e);
        super.handleNodeRemoved(e);
    }
    
}


class TextSandboxState extends NodeSandbox {
    
    constructor(details: { type: 'text', target: Text, data: any, core: Core }) {
        super(details);
    }
    
}
class CommentSandboxState extends NodeSandbox {
    
    constructor(details: { type: 'comment', target: Comment, data: any, core: Core }) {
        super(details);
    }
    
}

class PipeSandboxState {}

class ServiceSandboxState extends Sandbox implements ISandbox {
    private get config() { return this.core.configuration; }
    // private get director() { return this.config.director; }
    // public get channels() { return this.director.channels; }
    
    constructor(details: { type: 'service', target: Utilities, data: any, core: Core }) {
        super(details);
        return this;
    }
    
}

class MicroserviceSandboxState {}
class IoTSandboxState {}


function select(details: { type, target: any, data: any, core: Core }): any {
    var { type, target, data, core } = details;
    var Sandbox = {
        ['element']: ElementSandboxState,
        ['attribute']: AttributeSandboxState,
        ['text']: TextSandboxState,
        ['comment']: CommentSandboxState,
        ['pipe']: PipeSandboxState,
        ['service']: ServiceSandboxState,
        ['microservice']: MicroserviceSandboxState,
        ['iot']: IoTSandboxState,
    }[ type ] as any;
    var sandbox = new Sandbox(details);
    
    return sandbox;
}


class SandboxContext extends Sandbox implements ISandbox {
    public element: Element;  // stub
    public content: TemplateSubject;  // stub
    
    constructor(details: { type, target: any, data: any, core: Core }) {
        super(details);
        var sandbox = select(details);
        return sandbox;
    }
    
}


export {
    SandboxContext as Sandbox,
    ServiceSandboxState as ServiceSandbox,
    ElementSandboxState as NodeSandbox,
};
