
import { Core } from '@motorman/vertices/core/core';
import { Reactive as CommonSandbox } from '@motorman/core/sandbox';
import { Sandbox as CommonComponentSandbox } from '@motorman/vertices/sandbox';
import { Utilities } from '@motorman/core/utilities';
import { Subject } from '@motorman/core/utilities/patterns/behavioral/observer';
import { Director, ActionHandlers, StateHandlers, channels } from './director';

// class Dependencies {};  // mock
// var director = new Director({ channels, Dependencies, ActionHandlers, StateHandlers });


class ServiceSandbox {
    public http: any = { };
    
    constructor(utils: Utilities, director: Director) {
        return this;
    }
    
}


class TemplateSubject extends Subject {
    private template: string = '';
    private repository: Node&DocumentFragment = new DocumentFragment();
    private digestion: Node&HTMLDivElement = document.createElement('div');
    public content: NodeList|Node[] = [ ];
    
    constructor(private sandbox: ComponentSandbox) {
        super('content');
        var { repository, digestion } = this;
        repository.appendChild(digestion);
    }
    
    set(template: string = '') {
        var { digestion } = this;
        
        digestion.innerHTML = template;
        this.observation = this.content = Array.prototype.slice.call(digestion.childNodes);
        
        return this;
    }
    
}

class MutationManager {
    protected observer: MutationObserver = new MutationObserver( (r, o) => this.observe(r, o) );
    protected get node(): Node { return this.sandbox.node; }
    protected get core(): Core { return this.sandbox.core; }
    protected get precepts(): any { return this.core.$nodes.get(this.node); }
    protected get selector(): string { return this.precepts.selector; }
    
    constructor(private sandbox: ComponentSandbox) {}
    
    private observe(changes: MutationRecord[], observer: MutationObserver) {
        for(let mutation of changes) this[mutation.type](mutation);
    }
    
    private ['childList'](mutation: MutationRecord) {
        var { sandbox, node } = this;
        console.log('MutationManager - childList', mutation);
        sandbox.publish(sandbox.channels[''], { mutation, node });
    }
    private ['attributes'](mutation: MutationRecord) {
        var { sandbox, node, selector } = this;
        var { attributeName: name, target: element } = mutation;
        var attr = (element as Element).getAttributeNode(name);
        var isIO = ( (element as Element).matches(selector) && node.isSameNode(element) )  // source of change occurred on host-element
          , isInput  // dep?
          , isOutput  // dep?
          ;
        var detail = mutation
          , a = new CustomEvent('mutation', { detail })
          , e = new CustomEvent('mutation:attribute', { detail })
          , io = new CustomEvent('mutation:io', { detail })
          , i = new CustomEvent('mutation:input', { detail })
          , o = new CustomEvent('mutation:output', { detail })
          ;
        if (isIO) element.dispatchEvent(io);
        if (isInput) element.dispatchEvent(i);
        if (isOutput) element.dispatchEvent(o);
        attr.dispatchEvent(a);
        element.dispatchEvent(e);
        sandbox.publish(sandbox.channels['ELEMENT:MUTATION:ATTRIBUTE:OBSERVED'], mutation);  // !ALERT!: SANDBOX SHOULD ONLY COMMUNICATE TO INSTANCE THROUGH ISOLATE MEDIUM; THAT IS, DISPATCH ON NODE TO ISOLATE FROM OTHER MODULES. THAT IS, SANDBOX.PUBLISH SHOULD ONLY BE USED FOR EXPLICITLY PUBLISHED EVENTS/DATA TO PEERS.
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

class EventManagerX {
    private emit: (e: Event|CustomEvent) => any;
    get node(): Node { return this.sandbox.node; }
    get proxy(): EventTarget { return EventTarget.prototype; }
    // get proxy(): EventTarget { return this.node; }
    
    constructor(private sandbox: ComponentSandbox) {}
    
    connect() {
        var { node, proxy } = this;
        var successful = this.proxyEventTargetSource(proxy);
        
        node.addEventListener('*', this.handleAll, true);  // `useCapture`
        
        return this;
    }
    
    disconnect() {
        var { node, proxy } = this;
        
        node.removeEventListener('*', this.handleAll);
        proxy.dispatchEvent = this.emit;
        
        return this;
    }
    
    /**
     * @param : source := EventTarget
     *  *   EventTarget.prototype
     *  *   Node (Element, Attr, etc)
     * @usage : [Node].addEventListener('*', ({ detail: e }) => {...}, false);
     */
    proxyEventTargetSource(source: EventTarget) {
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
    
    public handleAll = (any: CustomEvent) => {
        var { detail: e } = any
          , { type, target } = <Event>e
        //   , { attributes } = <Element>target
          ;
        console.log('@ ANY', type, e, any);
        // var delegates = this.getEventDelegates(...attributes);
        var reType = new RegExp(`^\(${type}\)$`)  // attr.name
          , reInvocation = new RegExp(`^(.+)\((.*)\)$`)  // attr.value
          ;
        // if (has type in [Attr].name) call method from value with parameters
    };
    private getEventDelegates(attribute?: Attr, ...more: Attr[]): Map<Node, any> {
        var $delegates = new Map<Node, { key: string, type: string, operation: string, method: string, params: string  }>();
        console.log('DELEGATES', attribute, ...more);
        return $delegates;
    }
    
}

class EventManager {
    private emit: (e: Event|CustomEvent) => any;
    private $events: Map<string, any> = new Map();
    get events(): string[] { return Array.from( this.$events.keys() ); }
    get node(): Node { return this.sandbox.node; }
    get proxy(): EventTarget { return EventTarget.prototype; }
    get precepts(): any { return this.sandbox.core.$nodes.get(this.node); }
    get instance(): any { return this.precepts.instance; }
    
    constructor(private sandbox: ComponentSandbox) {}
    
    private proxyEventTargetSource(source: EventTarget): boolean {
        var { node } = this;
        
        this.getEventTypes(<Element>node);
        this.events.forEach( (type) => node.addEventListener(type, this.handleAll, true) );
        
        return !!this.events.length;
    }
    
    private getEventTypes(node: Node&Element): Node {
        if ( !{ [1]: true }[ node.nodeType ] ) return node;
        var { attributes, tagName } = node, re = /^\((.*)\)$/;
        
        // console.log('::::', tagName, node.firstChild, node.nextSibling);
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

class ComponentSandbox {
    private delegations: EventManager = new EventManager(this);
    private mutations: MutationManager = new MutationManager(this);
    public template: TemplateSubject = new TemplateSubject(this);
    public get config() { return this.core.configuration; }
    private get director() { return this.config.director; }
    public get channels() { return this.director.channels; }
    
    constructor(public node: any, public core: Core) {
        this.template.attach(this);
        this.mutations.connect();
        this.subscribe(this.channels['ELEMENT:MUTATION:ATTRIBUTE:OBSERVED'], (m) => console.log('ELEMENT:MUTATION:ATTRIBUTE:OBSERVED', m) );
        this.node.addEventListener('OUTPUT', (e) => console.log('OUTPUT', e), false );
        this.node.addEventListener('mutation:io', (e) => console.log('IO (io)', e), false);
        return this;
    }
    
    update(state: string = '') {  // Chain of Responsibility Pattern
        var { mutations, delegations, node } = this;
        mutations.disconnect();  // reconnect after to avoid mutation events
        node.innerHTML = '';  // clear current contents
        for (let child of state) node.appendChild(child);
        mutations.connect();  // reconnect after to avoid mutation events
        delegations.connect();
    }
    
    publish(channel: string, data?: any, ...more: any[]) {
        var { director, node } = this;
        // if ({ 'OUTPUT': true }[ channel ]) node.setAttribute(data.key, data.value);
        // if ({ 'OUTPUT': true }[ channel ]) node.dispatchEvent( new CustomEvent(channel, { detail: data }) );
        director.publish(channel, data, ...more);
        return this;
    }
    subscribe(channel: string, handler: Function, ...more: any[]) {
        this.director.subscribe(channel, handler, ...more);
        return this;
    }
    unsubscribe(channel: string, handler: Function, ...more: any[]) {
        this.director.unsubscribe(channel, handler, ...more);
        return this;
    }
    
}

export { ComponentSandbox as Sandbox, ServiceSandbox, ComponentSandbox };
