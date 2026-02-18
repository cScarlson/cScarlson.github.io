
import type { ToDo } from '@asxs/core/types';
import type { RemoteElementDefinition } from '@asxs/core/element';
import { Frameless } from '@asxs/core/element';
import { customElement } from '@asxs/core/customelement';

const { log } = console;
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
        const { head: red } = contentDocument!;
        const { children } = red;
        
        this.#compose(children as RemoteElementDefinition);
    };
    
    #compose(red: RemoteElementDefinition) {
        const { innerHTML: content, parentElement } = this;
        const { [0]: meta, [1]: template, [2]: styles, [3]: script } = red;  // RED (Remote Element Definition) protocol
        const { attributes: { [0]: { value: tagName } } } = meta as HTMLMetaElement;
        const nodes = parentElement?.matches(WRAPPER_TAGNAME) ? Array.from(parentElement.childNodes) : [];
        const slotted = nodes.filter(child => child !== this);
        const Class = customElements.get(tagName) as typeof Frameless;
        const element = new Class({ meta, template, styles, script });  // should everything after this be done by the RED?
        const sentinel = document.createElement('style');
        
        function handleScriptLoad(e: Event) {
            if (e.target !== sentinel) return;
            for (const child of slotted) element.appendChild(child);  // strongly-slotted content
            sentinel.remove();
            element.removeEventListener('load', handleScriptLoad, true);
        }
        
        element.innerHTML = content;  // weakly-slotted content
        element.addEventListener('load', handleScriptLoad, true);
        element.appendChild(sentinel);
        if (!parentElement) this.replaceWith(element);
        else if (parentElement.matches('as-frameless-slots')) parentElement.replaceWith(element);
        else this.replaceWith(element);  // if it has a parent but is not a known wrapper
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
