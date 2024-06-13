
import { default as utilities } from './utilities/utilities.js';

const { log, warn } = console;

export class CustomElement extends HTMLElement {
    static observedAttributes = [ ];
    $options = {};
    $shadow = null;
    
    constructor(options = {}) {
        super();
        this.$options = options;
        this.$shadow = this.attachShadow({ mode: 'open' });
    }
    
    async #initialize(state) {
        const { $shadow, $options } = this;
        const { template: content, templateURL: url, style, styleURL: uri } = $options;
        const template = url ? await this.#load(url) : content;
        const css = uri ? await this.#load(uri) : style;
        const event = new CustomEvent('hook:mounted', { });
        
        await this.#style($shadow, css);
        await this.#template($shadow, template, state);
        this.dispatchEvent(event);
        
        return true;
    }
    
    async #load(url) {
        const response = await fetch(url);
        const content = await response.text();
        return content;
    }
    
    async #style(shadow, css) {
        if (!css) return shadow;
        const style = document.createElement('style');
        
        style.innerHTML = css;
        shadow.appendChild( style );
        
        return shadow;
    }
    
    async #template(shadow, template, state) {
        if (!template) return shadow;
        const templ8 = document.createElement('template');
        
        templ8.innerHTML = utilities.interpolate(template)(state);
        shadow.appendChild( templ8.content );
        
        return shadow;
    }
    
    async connectedCallback() {
        await this.#initialize(this);
    }
    
    disconnectedCallback() {
        log('Custom element removed from page.');
    }
    
    attributeChangedCallback(name, old, val) {
        const handle = `attr:${name}`;
        if (handle in this) this[handle](val, old);
        else warn(`Attribute ${name} has changed but has no handler.`, old, val);
    }
    
    adoptedCallback() {
        log('Custom element moved to new page.');
    }
    
}
