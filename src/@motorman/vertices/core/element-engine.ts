
import { Utilities } from "@motorman/core/utilities";
import { StrictCommand as Command } from "@motorman/core/utilities/patterns/behavioral";

type ListenerMap = { type: string, name: string, handler: (e: Event, ...splat: any[]) => any };

class ConstructorProxy {
    private comm: any;
    private Sandbox: any;
    private element: HTMLElement;
    private director: any;
    public sandbox: any;

    constructor({ comm, Sandbox, element, director }) {
        this.comm = comm;
        this.Sandbox = Sandbox;
        this.element = element;
        this.director = director;
    }

    construct(Target, args) {
        var { Sandbox, comm, element, director } = this;
        var sandbox = new Sandbox(element, director);
        var params = [].concat(sandbox, 'extra');
        var data = { type: 'construct', Target, args };
        var result = Reflect.construct(Target, params /*, PrototypeConstructor*/);
        
        this.sandbox = sandbox;
        comm.publish(comm.channels['PROXY:INVOKED'], data);
        comm.publish(comm.channels['PROXY:CONSTRUCT:INVOKED'], data);
        
        return result;
    }
    
}

class MemberProxy {
    private comm: any;
    private source: any;
    private element: HTMLElement;

    constructor({ comm, source, element }) {
        this.comm = comm;
        this.source = source;
        this.element = element;
    }

    has(target: any, key: any) {
        var { source, comm } = this;
        var data = { type: 'has', source, key };
        var result = Reflect.has(source, key);
        
        comm.publish(comm.channels['PROXY:INVOKED'], data);
        comm.publish(comm.channels['PROXY:HAS:INVOKED'], data);
        
        return result;
    }

    get(target: any, key: any, receiver: any) {
        // if (target[key].call) return new Proxy( target[key], new MethodProxy({ comm: this.comm, source: this.source, element: this.element }) );
        var { source, comm, element } = this;
        var data = { type: 'get', source, key };
        var result = Reflect.get(source, key);  // omit receiver to get key of source
        
        comm.publish(comm.channels['PROXY:INVOKED'], data);
        comm.publish(comm.channels['PROXY:GET:INVOKED'], data);
        
        return result;
    }

    set(target: any, key: any, value: any, receiver: any) {
        var { source, comm } = this;
        var data = { type: 'set', source, key, value };
        var result = Reflect.set(source, key, value);
        
        comm.publish(comm.channels['PROXY:INVOKED'], data);
        comm.publish(comm.channels['PROXY:SET:INVOKED'], data);
        
        return result
    }

    deleteProperty(target: Function, key: any) {
        var { source, comm } = this;
        var data = { type: 'delete', source, key };
        var result = Reflect.deleteProperty(source, key);
        
        comm.publish(comm.channels['PROXY:INVOKED'], data);
        comm.publish(comm.channels['PROXY:DELETE:INVOKED'], data);
        
        return result;
    }

}

class MethodProxy {
    private comm: any;
    private source: any;
    private element: HTMLElement;

    constructor({ comm, source, element }) {
        this.comm = comm;
        this.source = source;
        this.element = element;
    }

    apply(target, thus, args) {
        var { source, comm } = this;
        var data = { type: 'apply', source, target, thus, args };
        var result = target.call(source, ...args);
        // var result = source[target.name](...args);
        // var result = target.call(thus, ...args);
        // var result = Reflect.apply(target, thus, args);
        
        comm.publish(comm.channels['PROXY:INVOKED'], data);
        comm.publish(comm.channels['PROXY:APPLY:INVOKED'], data);
        
        return result;
    }

}

class ProxyManager {  // sets up & manages proxy relationships
    
}

class Channels {
    ['PROXY:INVOKED'] = 'vcomm://invoked/proxy';
    ['PROXY:CONSTRUCT:INVOKED'] = 'vcomm://invoked/proxy/construct';
    ['PROXY:HAS:INVOKED'] = 'vcomm://invoked/proxy/has';
    ['PROXY:GET:INVOKED'] = 'vcomm://invoked/proxy/get';
    ['PROXY:SET:INVOKED'] = 'vcomm://invoked/proxy/set';
    ['PROXY:DELETE:INVOKED'] = 'vcomm://invoked/proxy/delete';
    ['PROXY:APPLY:INVOKED'] = 'vcomm://invoked/proxy/apply';
    ['PROXY:MOCK:INVOKED'] = 'vcomm://invoked/proxy/mock';
}
class EventHub {
    private target = new EventTarget();
    public channels: Channels = new Channels();

    constructor() {}

    publish(channel: string, data?: any) {
        var e = new CustomEvent(channel, { detail: data });
        this.target.dispatchEvent(e);
        return this;
    }
    subscribe(channel, handler) {
        this.target.addEventListener(channel, handler, false);
        return this;
    }
    unsubscribe(channel, handler) {
        this.target.removeEventListener(channel, handler, false);
        return this;
    }

}

class Comparitor {
    public previous: any = undefined;
    get name(): string { return this.attr.name; }
    get current(): any { return this.component[ this.name ]; }
    set current(value: any) { this.attr.value = value; }
    get equal(): boolean { return this.detect(); }
    get dirty(): boolean { return !this.equal; }
    
    constructor(private comm: EventHub, private component: any, private attr: Attr) {
        var { name, value } = attr;
        this.previous = value;
        return this;
    }
    
    detect() {
        var { comm, name, previous, current } = this;
        var equal = (previous === current);
        var details = { name, previous, current, equal };
        
        if (!equal) comm.publish(comm.channels['ELEMENT:ATTRIBUTE:CHANGE'], details);
        return equal;
    }
    
    update() {
        var { name, component } = this;
        this.previous = this.current = component[name];
        return this;
    }
    
}


class ElementEngine {
    
    constructor(private Sandbox: any, private director: any) {}
    
    private composeCommand(component: any, name: string) {
        var command = new Command(component, name);
        return command;
    }
    private composeExecutor(component: any, name: string) {
        var command = this.composeCommand(component, name), { execute } = command;
        return execute;
    }
    private composeOperand(component: any, operator: Function, name: string) {
        var execute = this.composeExecutor(component, name), operand = operator(execute);
        return operand;
    }
    
    private mapListener(component: any, item: any) {
        var { type, name } = item;
        var handler = this.composeExecutor(component, name), details = { type, name, handler };
        return details;
    }
    private mapSubscription(component, pipes, { type, name, operators: ops }) {  // pipes:= { name: 'fn', operator: filter }[], ops:= Set<string>
        var operators = pipes.filter( ({ name }) => ops.has(name) );  // eg: (new Set()).has(name)
        var operands = operators.map( ({ name, operator }) => this.composeOperand(component, operator, name) );  // eg: filter( fn, this )
        var data = { type, name, operators: operands };
        
        return data;
    }
    
    private getConfig(Class, element) {
        var { director, Sandbox } = this;
        
        var { observedAttributes = [], watchers = new Map() } = Class;
        var { listeners = [] } = Class;
        var { subscriptions = [], operators = [] } = Class;
        var { template = '', pTemplate } = Class;
        //
        var comm = new EventHub();
        var construction = new ConstructorProxy({ comm, Sandbox, element, director }); 
        var ClassProxy = new Proxy(Class, construction);
        var component = new ClassProxy({ state: false });
        var members = new MemberProxy({ comm, source: component, element });
        var methods = new MethodProxy({ comm, source: component, element });
        var proxy = new Proxy(component, members);
        var properties = Object.getOwnPropertyNames(Class.prototype);
        var methodBlacklist = { 'constructor': true, 'connectedCallback': true, 'attributeChangedCallback': true, 'disconnectedCallback': true, 'adoptedCallback': true };
        
        var listeners = listeners.map( (item) => this.mapListener(component, item) );  // map each handler to a handler bound to "component"
        var subscriptions = subscriptions.map( (item) => this.mapSubscription(component, operators, item) );  // map each handler to a handler bound to "component"
        
        var surrogate = Object.create(proxy);  // use Object.create to carry over get|set; spread op fails to do so
        for (let key in proxy) if (proxy[key].call) surrogate[key] = new Proxy(proxy[key], methods);
        properties.forEach( (key) => { if (!!component[key] && component[key].call && !methodBlacklist[key]) surrogate[key] = new Proxy(component[key], methods); });
        
        var config = {  // TODO: create fn
            comm,
            director,
            Sandbox,
            Class,
            ...{
                sandbox: construction.sandbox,
            },
            ...{
                template,
                pTemplate,
            },
            ...{
              observedAttributes,
              watchers,  
            },
            ...{
                listeners,
            },
            ...{
                subscriptions,
                operators,
            },
            ...{
                component,
                surrogate,
            },
        };
        
        return config;
    }
    
    private prepare(Class) {
        var thus = this;
        var { observedAttributes = [] } = Class;
        
        return class Element extends HTMLElement {  // https://alligator.io/web-components/attributes-properties/
            static observedAttributes: string[] = observedAttributes;  // native HTML Custom Elements
            protected $utils: Utilities = new Utilities();
            private config: any = thus.getConfig(Class, this);
            private comm: EventHub = this.config.comm;
            private $: any = this.config.sandbox;
            private component: any = this.config.component;
            private surrogate: any = this.config.surrogate;
            private listeners: ListenerMap[] = this.config.listeners;
            private subscriptions: any[] = this.config.subscriptions;
            private operators: any[] = this.config.operators;
            private $watchers: Map<string, any> = this.config.watchers;
            private template: string = this.config.template;
            private pTemplate: Promise<string> = this.config.pTemplate;
            private $comparitors: Map<string, Comparitor> = new Map();
            private handlers: any[] = [ ];
            get comparitors(): Comparitor[] { return Array.from( this.$comparitors.values() ); }
            get content(): string { return this.$utils.interpolate(this.template)(this.component); }
            set content(value: string) { this.innerHTML = value; }
            get attrs() { return observedAttributes; }
            
            constructor() {
                super();
                var { comm, component, listeners, subscriptions, operators, pTemplate } = this;
                var { observedAttributes: attributes } = Element;
                
                this.bind(component, attributes, listeners, subscriptions);
                this.init(this);
                
                pTemplate.then( (t) => this.template = t );
                comm.subscribe(comm.channels['PROXY:INVOKED'], this.handleProxyInvokation);
                comm.subscribe(comm.channels['PROXY:MOCK:INVOKED'], this.handleProxyInvokation);
                
                return this;
            }
    
            private init({ component, dataset, attributes }: Element) {
                this.initAttributes(this);
                if (component.init) component.init(dataset);
                return this;
            }
            private initAttributes({ component, attributes }: Element) {
                for (let i = 0, len = attributes.length; i < len; i++) this.initAttribute(component, attributes[i], i, attributes);
                return this;
            }
            private initAttribute(component, attribute: Attr, i?: number, attributes?: NamedNodeMap) {
                var { attrs } = this;
                var { name, value: attr } = attribute, value = component[name];
                
                if (!{ undefined: true, null: true, '': true }[ value ]) this.setAttribute(name, value);
                // attribute.addEventListener('change', (e) => console.log('$$$$$$$$$$$', e), false);
                // attribute.dispatchEvent( new CustomEvent('change', { detail: { name, value } }) );
                this.initAttributeComparitors(component, attrs);
                
                return this;
            }
            
            private initAttributeComparitors(component, attributes: string[]) {
                for (let i = 0, len = attributes.length; i < len; i++) this.initAttributeComparitor(component, attributes[i], i, attributes);
                return this;
            }
            private initAttributeComparitor(component, name: string, i, attrs: string[]) {
                var { comm, component, attributes } = this;
                var attr = attributes[name], comparitor = new Comparitor(comm, component, attr);
                
                this.$comparitors.set(name, comparitor);
                return this;
            }
            
            private bind(component: any, attributes: string[], listeners: ListenerMap[], subscriptions: ListenerMap[]) {
                attributes.forEach( (k) => this.bindAttribute(component, k) );
                listeners.forEach( (map) => this.bindListener(component, map) );
                subscriptions.forEach( (map) => this.bindMessageHandler(component, map) );
                
                return this;
            }
            private unbind() {}
            private bindAttribute(component: any, k: string) {
                var descriptor = Object.getOwnPropertyDescriptor(Class.prototype, k)
                  , descriptor = { ...descriptor }
                  , { get, set } = descriptor
                  ;
                var value = this.getAttribute(k);
                if (!value) this.setAttribute(k, component[k]);
                if (descriptor.get && descriptor.set) descriptor = { get, set };
                else if (!descriptor.get && !descriptor.set) descriptor = { get: () => this.getAttribute(k), set: (v) => this.setAttribute(k, v) };
                else if (!descriptor.get && descriptor.set) descriptor = { get: () => this.getAttribute(k), set };
                else if (descriptor.get && !descriptor.set) descriptor = { get, set: () => this.setAttribute(k, component[k]) };
                Object.defineProperty(component, k, descriptor);
                
                return this;
            }
            
            private bindListener(component: any, map: ListenerMap) {
                var { type, handler } = map;
                this.addEventListener(type, handler, false);
            }
            private unbindListener(component: any, map: ListenerMap) {
                var { type, handler } = map;
                this.removeEventListener(type, handler, false);
            }
            
            private bindMessageHandler(component: any, map: any) {
                var { type, name, operators } = map, { $ } = this, channel = $.channels[type];
                $.in(channel).pipe(...operators).subscribe( (...splat) => component[name](...splat) );
            }
            private unbindMessageHandler(component: any, map: ListenerMap) {
                var { type, handler } = map, { $ } = this;
                // $.in(type).unsubscribe(handler);
            }
            
            private inspectChildren(children: HTMLCollection) {  // #MutualRecursion
                Array.prototype.forEach.call( children, (c, i, a) => this.inspectChild(c, i, a) );
                return this;
            }
            private inspectChild(child: HTMLElement, i: number, children: HTMLCollection) {  // #MutualRecursion
                var { attributes, children } = child;
                
                this.inspectChildAttributes(attributes);
                if (children.length) this.inspectChildren(children);
                
                return this;
            }
            private inspectChildAttributes(attributes: NamedNodeMap) {
                Array.prototype.forEach.call( attributes, (attr, i, attrs) => this.inspectChildAttribute(attr, i, attrs) );
                return this;
            }
            private inspectChildAttribute(attr: Attr, i: number, attrs: NamedNodeMap) {
                var { name, value, ownerElement: child } = attr;
                // console.log('@CHILD ATTR', this.tagName, name, value, attr);
                if ( this.isRefBinding(attr) ) this.setRefBinding(attr);
                if ( this.isEventBinding(attr) ) this.$addEventListener(attr);
                return this;
            }
            
            private isRefBinding(attr: Attr): boolean {
                var { name, value, ownerElement: element } = attr;
                var is = !!this.getRefBinding(attr);
                return is;
            }
            private getRefBinding(attr: Attr): string {
                var { name, value, ownerElement: element } = attr;
                var matches = name.match(/^#(.+)$/), [ match, id ] = !!matches && matches.length && matches || [];
                return id;
            }
            private setRefBinding(attr: Attr) {
                var { component } = this;
                var { name, value, ownerElement: element } = attr;
                var id = this.getRefBinding(attr);
                component[id] = element;
                // console.log('--------- %s %s %s %s %s %O %O', this.tagName, name, id, element.id, component[id].id, element, component[id]);
                return this;
            }
            
            private isEventBinding(attr: Attr): boolean {
                var { ownerElement: element } = attr;
                var type = this.getEventBindingName(attr), namespace = `on${type}`, has = !!(namespace in element);
                return has;
            }
            private getEventBindingName(attr: Attr): any {
                var { name, value, ownerElement: element } = attr;
                var matches = name.match(/\((\w*)\)/), [ match, type ] = !!matches && matches.length && matches || [];
                return type;
            }
            private getEventBindingInvoker(attr: Attr): any {
                var { component: c, comm } = this;
                var { name, value } = attr;
                var [ match, method, args ] = value.match(/(\w*)\((.*)\)/);
                var params = args.match(/([^,\s]+)/g);
                // var exe = Function.prototype.call.bind(c[method], c);
                var exe = thus.composeExecutor(c, method);
                // var op = `with($_) return eval("$_['${method}'](${args})");`;
                var op = `with($_) return eval("h(${args})");`;
                var fn = new Function('$_', 'h', '$event', op);
                // var f = (e) => ( fn(c, exe, e), comm.publish(comm.channels['PROXY:MOCK:INVOKED'], { name, value, attr }) );  // <-- workaround
                var f = (e) => fn(c, exe, e);
                // var f = (e) => fn(c, e);
                // setTimeout( () => exe({ type: 'TEST' }, 'test', 'blah'), (1000 * 12) );
                // console.log('>>>>>>>>>>>>', method, c[method]);
                // exe({ type: 'TEST' }, 'test', 'blah');
                
                return f;
            }
            
            private $addEventListener(attr: Attr) {
                var { handlers } = this;
                var { name, value, ownerElement: element } = attr;
                var type = this.getEventBindingName(attr), handler = this.getEventBindingInvoker(attr);
                var cache = { name, value, element, type, handler };
                
                element.addEventListener(type, handler, false);
                handlers.push(cache);
                
                return this;
            }
            private $removeEventListeners() {
                var { handlers } = this;
                for (let i = handlers.length; i--;) this.$removeEventListener(handlers[i], i, handlers);
                return this;
            }
            private $removeEventListener(cache: any, i: number, caches: any[]) {
                var { name, value, element, type, handler } = cache;
                
                element.removeEventListener(type, handler, false);
                caches.splice(i, 1);
                
                return this;
            }
            
            private getDirtyAttributeStates(comparitors: Comparitor[]): Comparitor[] {
                var inequalities = comparitors.filter( (comparitor) => comparitor.dirty );
                return inequalities;
            }
            
            $draw() {
                var { component, content } = this;
                this.content = content;
                this.inspectChildren(this.children);
            }
            $load() {
                this.$unload();
                this.$draw();
            }
            $unload() {
                this.$removeEventListeners();
            }
            
            // https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks
            connectedCallback() {
                var { component, content } = this;
                if (component.attachedCallback) component.connectedCallback();
                this.$load();
            }
            attributeChangedCallback(attrName, oldVal, newVal) {
                var { component, content, $watchers } = this;
                var action = `[${attrName}]`, handler = component[action];
                var any = `[*]`, all = component[any];
                var $watcher = $watchers.get(attrName);
                
                if (component.attributeChangedCallback) component.attributeChangedCallback(attrName, oldVal, newVal);
                if (all) all.call(component, attrName, oldVal, newVal);
                if (handler) handler.call(component, newVal, oldVal);
                if ($watcher) $watcher.handler.call(component, newVal, oldVal);
                this.$load();
            }
            disconnectedCallback() {
                var { component, listeners, subscriptions } = this;
                if (component.detachedCallback) component.disconnectedCallback();
                listeners.forEach( (map) => this.unbindListener(component, map) );
                subscriptions.forEach( (map) => this.unbindMessageHandler(component, map) );
                this.$unload();
            }
            adoptedCallback() {
                var { component, content } = this;
                if (component.adoptedCallback) component.adoptedCallback();
                this.$load();
            }
            
            private handleProxyInvokation = (e: CustomEvent) => {
                var { component, attributes, content } = this;
                var { type, detail } = e, { type: method } = detail;
                var dirty = this.getDirtyAttributeStates(this.comparitors);
                
                dirty.forEach( ({ name }) => this.initAttribute(component, attributes[name]) );
                this.$load();
            };
            
        };
    }
    
    define(name, Class, options?: any) {
        if ( !!customElements.get(name) ) return this;
        var Element = this.prepare(Class);
        window.customElements.define(name, Element, options);
        
        return this;
    }
    
}

export { ElementEngine };
