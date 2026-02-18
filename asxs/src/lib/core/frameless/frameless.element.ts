
import type { ToDo } from '@asxs/core/types';
import { customElement } from '@asxs/core/customelement';

interface RemoteElementDefinition extends HTMLCollection {
    0: HTMLMetaElement,
    1: HTMLTemplateElement,
    2: HTMLStyleElement,
    3: HTMLScriptElement,
}

const { log } = console;

export const TAGNAME = 'as-frameless';
export @customElement(TAGNAME, { extends: 'iframe' }) class FramelessElement extends HTMLIFrameElement {
    #deferred: ToDo = (Promise as ToDo).withResolvers();
    #lightdom: HTMLCollection = document.createElement('div').children;
    #parent: any = null;
    
    constructor() {
        super();
        this.width = '0';
        this.height = '0';
    }
    
    #initialize = () => {
        const { contentDocument } = this;
        const { head: red } = contentDocument!;
        const { children } = red;
        
        this.#compose(children as RemoteElementDefinition);
    };
    
    #compose(red: RemoteElementDefinition) {
        const { innerHTML, parentElement } = this;
        const { [0]: meta, [1]: template, [2]: styles, [3]: script } = red;  // RED (Remote Element Definition) protocol
        const { attributes: { [0]: { value: tagName } } } = meta as HTMLMetaElement;
        const { content } = template as HTMLTemplateElement;
        const element = document.createElement(tagName);
        const module = document.createElement('script');
        const sentinel = document.createElement('style');
        const nodes = getSlottedNodes(parentElement!);
        const slotted = nodes.filter(child => child !== this);
        
        function getSlottedNodes(parentElement: HTMLUnknownElement) {
            if (!parentElement) return [];
            if (!parentElement.matches('as-frameless-slots')) return [];
            return Array.from(parentElement.childNodes);
        }
        
        function handleScriptLoad(e: Event) {
            if (e.target !== sentinel) return;
            const { shadowRoot } = element as HTMLUnknownElement;
            const shadow = shadowRoot!;
            
            shadow.appendChild(styles);
            shadow.appendChild(content);
            for (const child of slotted) element.appendChild(child);
            element.removeEventListener('load', handleScriptLoad, true);
            module.remove();
            sentinel.remove();
        }
        
        log(`@compose... %O`, this, innerHTML, element, this.childNodes);
        module.innerHTML = script.innerHTML;
        element.innerHTML = innerHTML;
        element.addEventListener('load', handleScriptLoad, true);
        element.appendChild(module);
        element.appendChild(sentinel);
        if (!parentElement) this.replaceWith(element);
        else if (parentElement.matches('as-frameless-slots')) parentElement.replaceWith(element);
        else this.replaceWith(element);
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
