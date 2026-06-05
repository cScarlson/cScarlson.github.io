
import { utilities } from '/asxs/v2.0.0/core/utilities/utilities.js';
import { root } from './window.js';

const { frameElement } = window;
const { HTMLElement, console } = root;
const { log } = console;

frameElement.style.setProperty('box-sizing', 'border-box', 'important');
frameElement.style.setProperty('margin', '0', 'important');
frameElement.style.setProperty('border', 'none', 'important');
frameElement.style.setProperty('width', '100%', 'important');
frameElement.style.setProperty('height', '100dvh', 'important');

class Nativeish extends HTMLElement {
    static observedAttributes = [];
    root = this;
    
    stabilize() {
        frameElement.remove();
    }
    
    idle() {
        this.moveBefore(frameElement, null);
    }
    
    connectedCallback() {}
    
    disconnectedCallback() {
        delete this.root;
    }
    
    adoptedCallback() {}
    
    connectedMoveCallback() {}
    
    attributeChangedCallback(name, old, val) {
        if (`attr:${name}` in this) this[`attr:${name}`](val, old);
    }
    
}

class Basic extends Nativeish {
    root = this.createRenderRoot();
    template = document.querySelector('template');
    style = document.querySelector('style');
    
    handleEvent(e) {  // e.g: <input data-(focus)="handleFocus" /> & { 'focus:handleFocus': (e) => e }
        const { type, target } = e;
        const { dataset } = target;
        const { [`(${type})`]: handler } = dataset;
        const { [`${type}:${handler}`]: handle } = this;
        
        if (handle) handle.call(this, e);
        else warn(`WARNING. Uncaught Event: "${type}" expected handler "${handler}".`);
    }
    
    createRenderRoot() {
        return this.attachShadow({ mode: 'open' });
    }
    
    update() {
        const { root, template, style } = this;
        const { ['as:crawler']: crawler, ['as:update:handler']: handle } = this;
        const { children } = root;
        const { content } = template;
        
        root.appendChild(style);
        root.appendChild(content);
        if (crawler) crawler.execute(...children);
        if (handle) handle.call(this, content);
        this.stabilize();  // must occur after nodes have new ownerDocument
    }
    
}

class Autorender extends Basic {
    #template = this.template.innerHTML;
    
    connectedCallback( x = super.connectedCallback() ) {
        this.update();
    }
    
    update() {
        const { document } = parent;
        const innerHTML = this.render();
        const interpolated = utilities.interpolate(innerHTML)(this);
        const next = document.createElement('template');
        
        next.innerHTML = interpolated;
        this.template = next;
        super.update();
    }
    
    render() {
        return this.#template;
    }
    
}

class Sandbox extends Autorender {
    #assets = [ ...document.querySelectorAll('link.global.asset') ];  // force to <link />s; <script>s can be dangerous.
    
    update() {
        const links = this.#assets.filter(el => el.tagName === 'LINK');
        links.forEach( link => parent.document.head.appendChild(link) );
        super.update();
    }
    
}

class CustomElement extends Sandbox {}

export { CustomElement };
export {
    Nativeish as Easy,
    Basic as Normal,
    Autorender as Heroic,
    Sandbox as Legendary
};
