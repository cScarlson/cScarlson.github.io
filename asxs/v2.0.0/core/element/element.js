
import { utilities } from '/asxs/v2.0.0/core/utilities/utilities.js';

const { top, frameElement } = window;
const { HTMLElement, console, document: { head } } = top;
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
        head.moveBefore(frameElement, null);
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
    static styles = Basic.styles || new Map();  // @footnotes#styles
    root = this.createRenderRoot();
    template = document.querySelector('template').cloneNode(true);
    style = Basic.styles.getOrInsert( location.href, document.querySelector('style') );
    
    handleEvent(e) {  // e.g: <input data-(focus)="handleFocus" /> & { 'focus:handleFocus': (e) => e }
        const { type, target } = e;
        const { dataset } = target;
        const { [`(${type})`]: referent } = dataset;
        const { [`handle:${referent}:${type}`]: handle } = this;
        
        if (handle) handle.call(this, e);
        else warn(`WARNING. Uncaught Event: "${type}" expected handler referent "${referent}".`);
    }
    
    createRenderRoot() {
        return this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback( x = super.connectedCallback() ) {
        const { template } = this;
        if ('crawler:template' in this) this['crawler:template'].execute(template);
    }
    
    update() {
        const { root, template, style } = this;
        const { content } = template;
        
        root.appendChild(style);
        root.appendChild(content);
        this.stabilize();  // must occur after nodes have new ownerDocument
    }
    
}

class Autorender extends Basic {
    #template = this.template;
    
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
        return this.#template.innerHTML;
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

/* ================================================================================================================================
@footnotes#styles
NOTE: this line has the potential to incur a Memory Leak as there is no obvious way to perform cache invalidation on its 
collection.

When using an RMD router (or perhaps any navigation that repeatedly reloads the same RMD), the HTMLStyleElement instance 
(this.style) became null on consecutive reloads of the given RMD after the Custom Element instance (Basic) was disconnected and 
destroyed from the Heap. After such, reloading the Custom Element reinstantiated the instance from the static class, which 
thereafter existed only in the top frame (window.top); this is because window.top.customElements.define was never called again 
(as it's behind an if-statement for error prevention). Therefore, calling [the child frame's] document.querySelector no longer 
retrieved a style node from the child frame's document/body but simply could not find one because the child frame's `document` 
object queried a separate Browsing Context, which had already been destroyed after the first load of the RMD. That is, it was 
using something of a "Ghost Browsing Context" to call document.querySelector. In other words: {ghost}.querySelector returns null.


@footnotes#{template}
...
================================================================================================================================ */
