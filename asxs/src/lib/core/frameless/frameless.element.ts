
import type { ToDo } from '@asxs/core/types';
import type { RemoteElementDefinition } from '@asxs/core/element';
import { Frameless } from '@asxs/core/element';
import { customElement } from '@asxs/core/customelement';
import { RemotelyDefinedElement } from './container.element';

const { log, warn, error: err } = console;
const WRAPPER_TAGNAME = 'as-frameless-slots';

export const TAGNAME = 'as-frameless';
export @customElement(TAGNAME, { extends: 'iframe' }) class FramelessElement extends HTMLIFrameElement {
    #deferred: ToDo = (Promise as ToDo).withResolvers();
    
    constructor() {
        super();
        this.width = '0';  // ensure no iframe actually appears to user
        this.height = '0';  // ensure no iframe actually appears to user
        this.style.border = 'none';  // ensure no iframe actually appears to user
    }
    
    #initialize = () => {
        const { contentDocument } = this;
        const { body: red } = contentDocument!;
        const { children } = red;
        
        this.#compose(children as RemoteElementDefinition, contentDocument!);
    };
    
    #compose(red: RemoteElementDefinition, contentDocument: Document) {
        const { parent } = window;
        const { customElements } = parent as any;
        const { [0]: meta } = red;  // RED (Remote Element Definition) protocol
        const { attributes: attrs } = meta as HTMLMetaElement;
        const { [0]: attr } = attrs;
        const { value: tagName } = attr;
        const { [`compose:${tagName}`]: handle } = this as ToDo;
        const Class = customElements.get(tagName) as typeof Frameless;
        const defined = !!Class;
        
        if (defined) return this['compose:webcomponent'](red, contentDocument);
        if (handle) handle.call(this, red);
    }
    
    ['compose:webcomponent'](red: RemoteElementDefinition, contentDocument: Document) {  // <meta name="{tagName}" />
        const { innerHTML: content, parentElement, attributes } = this;
        const { [0]: meta, [1]: template, [2]: styles, [3]: script } = red;  // RED (Remote Element Definition) protocol
        const { attributes: { [0]: { value: tagName } } } = meta as HTMLMetaElement;
        const nodes = parentElement?.matches(WRAPPER_TAGNAME) ? Array.from(parentElement.childNodes) : [];
        const slotted = nodes.filter(child => child !== this);
        const Class = customElements.get(tagName) as typeof Frameless;
        const element = new Class({ meta, template, styles, script, attributes, contentDocument });
        const container = new RemotelyDefinedElement({ meta, template, styles, script, attributes, contentDocument });
        const sentinel = document.createElement('style');
        
        function handleScriptLoad(e: Event) {
            if (e.target !== sentinel) return;
            sentinel.remove();
            element.removeEventListener('load', handleScriptLoad, true);
        }
        
        this.after(container);
        // element.innerHTML = content;  // weakly-slotted content
        // element.addEventListener('load', handleScriptLoad, true);
        // element.appendChild(sentinel);
        // for (const child of slotted) element.appendChild(child);  // strongly-slotted content
        // if (!parentElement) this.replaceWith(element);
        // else if (parentElement.matches('as-frameless-slots')) parentElement.replaceWith(element);
        // else this.replaceWith(element);  // if it has a parent but is not a known wrapper
    }
    
    ['compose:webcomponent:x'](red: RemoteElementDefinition) {  // <meta name="{tagName}" />
        // const { innerHTML: content, parentElement, attributes } = this;
        // const { [0]: meta, [1]: template, [2]: styles, [3]: script } = red;  // RED (Remote Element Definition) protocol
        // const { attributes: { [0]: { value: tagName } } } = meta as HTMLMetaElement;
        // const nodes = parentElement?.matches(WRAPPER_TAGNAME) ? Array.from(parentElement.childNodes) : [];
        // const slotted = nodes.filter(child => child !== this);
        // const Class = customElements.get(tagName) as typeof Frameless;
        // const element = new Class({ meta, template, styles, script, attributes });
        // const sentinel = document.createElement('style');
        
        // function handleScriptLoad(e: Event) {
        //     if (e.target !== sentinel) return;
        //     sentinel.remove();
        //     element.removeEventListener('load', handleScriptLoad, true);
        // }
        
        // element.innerHTML = content;  // weakly-slotted content
        // element.addEventListener('load', handleScriptLoad, true);
        // element.appendChild(sentinel);
        // for (const child of slotted) element.appendChild(child);  // strongly-slotted content
        // if (!parentElement) this.replaceWith(element);
        // else if (parentElement.matches('as-frameless-slots')) parentElement.replaceWith(element);
        // else this.replaceWith(element);  // if it has a parent but is not a known wrapper
    }
    
    ['compose:static'](red: RemoteElementDefinition) {  // <meta name="static" />
        warn(`Static RED HMTL is not implemented yet`);
    }
    
    #handleLoad(e: Event) {
        this.#deferred.resolve(true);
    }
    
    handleEvent(e: Event) {
        if (e.type === 'load') return this.#handleLoad(e);
    }
    
    connectedCallback() {
        const { promise } = this.#deferred;
        promise.then(this.#initialize);
        this.addEventListener('load', this, true);
    }
    
    disconnectedCallback() {
        this.removeEventListener('load', this, true);
    }
    
};
