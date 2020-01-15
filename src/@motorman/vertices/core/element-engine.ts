
import { Utilities } from "@motorman/core/utilities";

type ListenerMap = { type: string, name: string, handler: (e: Event, ...splat: any[]) => any };

class ElementEngine {
    
    constructor(private Sandbox: any, private director: any) {}
    
    private mapSubscriptions(component, pipes, { type, name, handler, operators: ops }) {  // pipes:= { name: 'fn', operator: filter }[], ops:= Set<string>
        var operators = pipes.filter( ({ name }) => ops.has(name) );  // eg: (new Set()).has(name)
        var operands = operators.map( ({ name, operator }) => operator(component[name], component)  );  // eg: filter( fn, this )
        return { type, name, handler: handler.bind(component), operators: operands };
    }
    
    private prepare (Class, Sandbox, director) {
        var thus = this;
        var { observedAttributes = [], watchers: $watchers = new Map() } = Class;
        var { listeners: domHandlers = [] } = Class;
        var { subscriptions: edaHandlers = [], operators: pipeOperators = [] } = Class;
        var { template = '' } = Class;
        
        return class Element extends HTMLElement {  // https://alligator.io/web-components/attributes-properties/
            static observedAttributes: string[] = observedAttributes;
            protected $utils: Utilities = new Utilities();
            private $: typeof Sandbox = new Sandbox(this, director);
            private template: string = template;
            private component: any = new Class(this.$);
            private listeners: ListenerMap[] = domHandlers;
            private subscriptions: any[] = edaHandlers;
            private operators: any[] = pipeOperators;
            private $watchers: Map<string, any> = $watchers;
            get content() { return this.$utils.interpolate(this.template)(this.component); }
            set content(value: any) { this.innerHTML = value; }
            
            constructor() {
                super();
                var { component, dataset, listeners: dom, subscriptions: eda, operators: ops } = this;
                var { observedAttributes: attributes } = Element;
                var listeners = dom.map( ({ type, name, handler }) => ({ type, name, handler: handler.bind(component) }) );  // map each handler to a handler bound to "component"
                var subscriptions = eda.map( (item) => thus.mapSubscriptions(component, ops, item) );  // map each handler to a handler bound to "component"
                
                this.listeners = dom;  // restore mapped array
                this.subscriptions = eda;  // restore mapped array
                this.bind(component, attributes, listeners, subscriptions);
                if (component.init) component.init(dataset);
                
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
                Object.defineProperty(component, k, { get: () => this.getAttribute(k), set: (v) => this.setAttribute(k, v) });
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
                var { type, handler, operators } = map, { $ } = this, channel = $.channels[type];
                $.in(channel).pipe(...operators).subscribe(handler);
            }
            private unbindMessageHandler(component: any, map: ListenerMap) {
                var { type, handler } = map, { $ } = this;
                // $.in(type).unsubscribe(handler);
            }
            
            createdCallback() {
                var { component, content } = this;
                if (component.createdCallback) component.createdCallback();
                this.content = content;
            }
            attachedCallback() {
                var { component, content } = this;
                if (component.attachedCallback) component.attachedCallback();
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
            detachedCallback() {
                var { component, listeners, subscriptions } = this;
                if (component.detachedCallback) component.detachedCallback();
                listeners.forEach( (map) => this.unbindListener(component, map) );
                subscriptions.forEach( (map) => this.unbindMessageHandler(component, map) );
            }
            
        };
    }
    
    define(name, Class, options?: any) {
        if ( !!customElements.get(name) ) return this;
        var { Sandbox, director } = this;
        var Element = this.prepare(Class, Sandbox, director);
        customElements.define(name, Element, options);
        
        return this;
    }
    
}

export { ElementEngine };
