
import { console, fetch, utilities } from '/browserless/core.js';
import { metadata } from '/browserless/kit/decorators/metadata.js';

const { log } = console;

export class Sandbox {
    static target = new EventTarget();
    get shadow() { return this.element?.shadowRoot }
    get medium() { return Sandbox.target }
    
    constructor(element) {
        const { internals } = element;
        const { states } = internals;
        
        this.element = element;
        this.internals = internals;
        this.states = states;
    }
    
    async initialize({ dataset }) {
        this.template = await this.#get('template', dataset);
        this.styles = await this.#get('styles', dataset);
        return this;
    }
    
    async #get(type, { [type]: url }) {
        if (url === metadata[type]) return '';
        const response = await fetch(url);
        return await response.text();
    }
    
    publish(channel, data) {
        const event = new MessageEvent(channel, { data });
        this.medium.dispatchEvent(event);
        return this;
    }
    
    subscribe(channel, handler) {
        this.medium.addEventListener(channel, handler, true);
        return this;
    }
    
    unsubscribe(channel, handler) {
        this.medium.removeEventListener(channel, handler, true);
        return this;
    }
    
    fire(channel, detail) {
        const event = new CustomEvent(channel, { detail });
        this.element.dispatchEvent(event);
        return this;
    }
    
    on(channel, handler, options = false) {
        this.element.addEventListener(channel, handler, options);
        return this;
    }
    
    off(channel, handler, options = false) {
        this.element.removeEventListener(channel, handler, options);
        return this;
    }
    
    interpolate(data) {
        const { template } = this;
        const interpolated = utilities.interpolate(template)(data);
        
        this.$template = template;
        this.template = interpolated;
        
        return this;
    }
    
};
