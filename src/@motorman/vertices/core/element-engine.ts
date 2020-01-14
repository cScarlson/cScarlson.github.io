
import { Utilities } from "@motorman/core/utilities";

type ListenerMap = { key: string, type: any, handler: (e: any) => {} };

class ElementEngine {
    
    constructor(private Sandbox: any, private director: any) {}
    
    private prepare = (Class, Sandbox, director) => class Element extends HTMLElement {  // https://alligator.io/web-components/attributes-properties/
        static observedAttributes: string[] = Class.observedAttributes;
        protected $utils: Utilities = new Utilities();
        private $: typeof Sandbox = new Sandbox(this, director);
        private template: any = Class.template;
        private component: any = new Class(this.$);
        private listeners: ListenerMap[] = [ ];
        get content() { return this.$utils.interpolate(this.template)(this.component); }
        set content(value: any) { this.innerHTML = value; }
        
        constructor() {
            super();
            var { component, dataset } = this, { observedAttributes: attributes } = Element;
            var re = /^\$on:(.+)/
              , keys = Object.keys(component).filter( (k) => re.test(k) )
              , listeners = keys.map( (key) => ({ key, type: key.replace(re, '$1'), handler: (...splat: any[]) => component[key].call(component, ...splat) }) )
              ;
            
            if (component.init) component.init(dataset);
            this.listeners = listeners;
            this.bind(component, attributes, listeners);
            
            return this;
        }
        
        private bind(component: any, attributes: string[], listeners: ListenerMap[]) {
            attributes.forEach( (k) => this.bindAttribute(component, k) );
            listeners.forEach( (map) => this.bindListener(component, map) );
            return this;
        }
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
            var { component, content } = this;
            var action = `[${attrName}]`, handler = component[action];
            var any = `[*]`, all = component[any];
            
            if (component.attributeChangedCallback) component.attributeChangedCallback(attrName, oldVal, newVal);
            if (all) all.call(component, attrName, oldVal, newVal);
            if (handler) handler.call(component, newVal, oldVal);
            this.content = content;
        }
        detachedCallback() {
            var { component, listeners } = this;
            if (component.detachedCallback) component.detachedCallback();
            listeners.forEach( (map) => this.unbindListener(component, map) );
        }
        
    };
    
    define(name, Class, options?: any) {
        if ( !!customElements.get(name) ) return this;
        var { Sandbox, director } = this;
        var Element = this.prepare(Class, Sandbox, director);
        customElements.define(name, Element, options);
        
        return this;
    }
    
}

export { ElementEngine };
