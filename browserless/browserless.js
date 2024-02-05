
import { console } from './core.js';

const { log } = console;

const decorate = ({ core, decorators }) => class Class extends HTMLElement {
    constructor() {
        super().attachShadow({ mode: 'open' });
        const { attributes } = this;
        this.internals = this.attachInternals();
        for (let attr of attributes) this.#mount(attr);
    }
    
    #mount(attr) {
        const { directives } = core;
        const { name } = attr;
        const id = `[${name}]`;
        const decorators = directives.get(id);
        
        if (decorators) this.#decorate(attr, ...decorators);
    }
    
    #continue(element, ...more) {
        if (!element) return;
        const { attributes, children } = element;
        
        for (let attr of attributes) this.#mount(attr);
        if (more.length) this.#continue(...more);
        if (children.length) this.#continue(...children);
    }
    
    #template(template = '') {
        const { shadowRoot: shadow } = this;
        const tpl = document.createElement('template');
        
        tpl.innerHTML = template;
        shadow.appendChild( tpl.content.cloneNode(true) );
    }
    
    #style(styles = '') {
        const { shadowRoot: shadow } = this;
        const { adoptedStyleSheets } = shadow;
        const original = adoptedStyleSheets.join(' ')
        const sheet = new CSSStyleSheet();
        
        sheet.replaceSync(`${original} :host { display: block } ${styles}`);
        shadow.adoptedStyleSheets = [ sheet ];
    }
    
    async #instantiate() {
        const { children } = this;
        const instance = this.#decorate(this, ...decorators);
        
        await this.#continue(...children);
        await this.#initialize(instance);
        
        return instance;
    }
    
    async #initialize(instance) {
        if ( !(await instance) ) return;
        const { metadata } = await instance;
        const { template, styles } = metadata;
        const t = await template;
        const s = await styles;
        
        this.#template(t);
        this.#style(s);
    }
    
    async #decorate(node, decorator, ...more) {
        const instance = await decorator.call(node, node);
        if (more.length) return await this.#decorate(instance, ...more);
        return instance;
    }
    
    async connectedCallback() {
        const instance = await this.#instantiate();
        this.instance = instance;
        if ('connectedCallback' in instance) instance.connectedCallback();
    }
    
    async disconnectedCallback() {
        if (!await this.instance) return;
        const { instance: promise } = this;
        const instance = await promise;
        if ('disconnectedCallback' in instance) instance.disconnectedCallback();
    }
    
};

const Facade = function Facade(core) {
    
    function register(...splat) {
        core.register(...splat);
        return this;
    }
    
    function attr(...splat) {
        core.attr(...splat);
        return this;
    }
    
    // export precepts
    this.register = register;
    this.attr = attr;
    this.bootstrap = core.bootstrap.bind(core);
    
    return this;
};

class Core extends Map {
    directives = new Map();
    
    register(selector, ...decorators) {
        this.set(selector, decorators);
        return this;
    }
    
    #define(selector, ...decorators) {
        const Class = decorate({ core: this, decorators });
        customElements.define(selector, Class);
        return this;
    }
    
    attr(selector, ...decorators) {
        const { directives } = this;
        directives.set(selector, decorators);
        return this;
    }
    
    bootstrap() {
        const { children } = document;
        for (let [selector, decorators] of this) this.#define(selector, ...decorators);
        this.#continue(...children);
    }
    
    #continue(node, ...more) {
        if (!node) return;
        const { attributes, children } = node;
        
        this.#mount(...attributes);
        if (more.length) this.#continue(...more);
        this.#continue(...children);
    }
    
    #mount(attr, ...more) {
        if (!attr) return;
        const { directives } = this;
        const { name, value, ownerElement: owner } = attr;
        const { tagName } = owner;
        const id = `[${name}]`;
        const decorators = directives.get(id);
        
        if ( customElements.get(tagName.toLowerCase()) ) return;
        if (!decorators) return;
        if (more.length) this.#mount(...more);
    }
    
}

export const f = new (function F(Core, Facade) {
    return Facade.call(function f(...splat) {
        if (this instanceof f) return new F(Core, Facade);
        f.register(...splat);
        return f;
    }, new Core());
})(Core, Facade);
