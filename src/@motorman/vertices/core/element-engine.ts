
import { Utilities } from "@motorman/core/utilities";
import { StrictCommand as Command } from "@motorman/core/utilities/patterns/behavioral";

type ListenerMap = { type: string, name: string, handler: (e: Event, ...splat: any[]) => any };
type Comparitor = { name: string, compare: Function };

interface ValueComparison {
    name: string;
    equal: boolean;
    previous: any;
    current: any;
}

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
        var { source, comm } = this;
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

    apply(target, thus, args) {
        var { source, comm } = this;
        var data = { type: 'apply', source, target, thus, args };
        var result = target.call(source, ...args);
        
        comm.publish(comm.channels['PROXY:INVOKED'], data);
        comm.publish(comm.channels['PROXY:APPLY:INVOKED'], data);
        
        return result;
    }

}

class Channels {
    ['PROXY:INVOKED'] = 'vcomm://invoked/proxy';
    ['PROXY:CONSTRUCT:INVOKED'] = 'vcomm://invoked/proxy/construct';
    ['PROXY:HAS:INVOKED'] = 'vcomm://invoked/proxy/has';
    ['PROXY:GET:INVOKED'] = 'vcomm://invoked/proxy/get';
    ['PROXY:SET:INVOKED'] = 'vcomm://invoked/proxy/set';
    ['PROXY:DELETE:INVOKED'] = 'vcomm://invoked/proxy/delete';
    ['PROXY:APPLY:INVOKED'] = 'vcomm://invoked/proxy/apply';
}
class EventHub {
    private target = new EventTarget();
    public channels: Channels = new Channels();

    constructor() {}

    publish(channel, data) {
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

function compareValues(name: string, previous: any): Function {
    return function compare(current: any): ValueComparison {
        var equal = (previous === current);
        return { name, equal, previous, current };
    };
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
        var proxy = new Proxy(component, members);
        
        var listeners = listeners.map( (item) => this.mapListener(component, item) );  // map each handler to a handler bound to "component"
        var subscriptions = subscriptions.map( (item) => this.mapSubscription(component, operators, item) );  // map each handler to a handler bound to "component"
        
        var surrogate = Object.create(proxy);  // use Object.create to carry over get|set; spread op fails to do so
        for (let key in proxy) if (proxy[key].call) surrogate[key] = new Proxy(proxy[key], members);
        
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
                
                return this;
            }
            
            private getBindingName(attr: Attr): any {
                var { name, value, ownerElement: element } = attr;
                var matches = name.match(/\((\w*)\)/), [ match, type ] = !!matches && matches.length && matches || [];
                return type;
            }
            private isEventBinding(attr: Attr): boolean {
                var { ownerElement: element } = attr;
                var type = this.getBindingName(attr), namespace = `on${type}`, has = !!(namespace in element);
                return has;
            }
            private getEventBindingInvoker(attr: Attr, component: any): any {
                var { name, value } = attr;
                var [ match, method, args ] = value.match(/(\w*)\((.*)\)/);
                var params = args.match(/([^,\s]+)/g);
                var op = `with($_) return eval("$_['${method}'](${args})");`;
                var fn = new Function('$_', '$event', `with($_) return eval("$_['${method}'](${args})");`);
                var f = (e) => fn(component, e);
                // console.log('>', method, args, params, args, op);
                
                return f;
            }
    
            private init({ component, dataset, attributes }: Element) {
                // console.log('@ributes', this.tagName, attributes);
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
                
                if ( this.isEventBinding(attribute) ) this.addEventListener( this.getBindingName(attribute), this.getEventBindingInvoker(attribute, component), false );
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
            private initAttributeComparitor(component, name: string, i, attributes: string[]) {
                var value = component[name], compare = compareValues(name, value);
                this.$comparitors.set(name, { name, compare });
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
            
            getDirtyAttributeStates(comparitors: Comparitor[]): Comparitor[] {
                var inequalities = comparitors.filter( (comparitor) => this.compareAttributeValues(comparitor) );
                return inequalities;
            }
            compareAttributeValues(comparitor: Comparitor) {
                var { name, compare } = comparitor, { [name]: current } = this.component;
                var comparison = compare(current), { equal } = comparison;
                return !equal;
            }
            
            // https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks
            connectedCallback() {
                var { component, content } = this;
                if (component.attachedCallback) component.connectedCallback();
                this.content = content;
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
                this.content = content;
            }
            disconnectedCallback() {
                var { component, listeners, subscriptions } = this;
                if (component.detachedCallback) component.disconnectedCallback();
                listeners.forEach( (map) => this.unbindListener(component, map) );
                subscriptions.forEach( (map) => this.unbindMessageHandler(component, map) );
            }
            adoptedCallback() {
                var { component, content } = this;
                if (component.adoptedCallback) component.adoptedCallback();
                this.content = content;
            }
            
            private handleProxyInvokation = (e: CustomEvent) => {
                var { component, attributes, content } = this;
                var { type, detail } = e, { type: method } = detail;
                var dirty = this.getDirtyAttributeStates(this.comparitors);
                dirty.forEach( ({ name }) => this.initAttribute(component, attributes[name]) );
                this.content = content;
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
