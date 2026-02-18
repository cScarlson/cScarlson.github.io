
import type { ToDo } from '@asxs/core/types';
import type { RemoteElementDefinition, RemoteElementDefinitionOptions } from '@asxs/core/element';
import { Frameless } from '@asxs/core/element';
import { customElement } from '@asxs/core/customelement';
import { utilities } from '@asxs/core/utilities';

const { log } = console;

export const TAGNAME = 'as-frameless';
export @customElement(TAGNAME, { extends: 'iframe' }) class FramelessElement extends HTMLIFrameElement {
    #deferred: ToDo = (Promise as ToDo).withResolvers();
    
    constructor() {
        super();
        this.width = '0';  // ensure no iframe actually appears to user
        this.height = '0';  // ensure no iframe actually appears to user
    }
    
    #initialize = () => {
        const { contentDocument } = this;
        const { head: red } = contentDocument!;
        const { children } = red;
        
        this.#compose(children as RemoteElementDefinition);
    };
    
    #define(script: HTMLScriptElement) {
        const module = document.createElement('script');
        
        module.innerHTML = script.innerHTML;
        document.body.appendChild(module);
        
        return module;
    }
    
    #compose(red: RemoteElementDefinition) {
        const { innerHTML: content, parentElement } = this;
        const { [0]: meta, [1]: template, [2]: styles, [3]: script } = red;  // RED (Remote Element Definition) protocol
        const { attributes: { [0]: { value: tagName } } } = meta as HTMLMetaElement;
        const { innerHTML } = template as HTMLTemplateElement;
        const nodes = getSlottedNodes(parentElement!);
        const slotted = nodes.filter(child => child !== this);
        const module = this.#define(script);
        const Class = customElements.get(tagName) as typeof Frameless;
        const element = new Class({ meta, template, styles, script });  // should everything after this be done by the RED?
        const css = utilities.interpolate(styles.innerHTML)(element.__state__);
        const $template = document.createElement('template');
        const sentinel = document.createElement('style');
        
        function getSlottedNodes(parentElement: HTMLUnknownElement) {
            if (!parentElement) return [];
            if (!parentElement.matches('as-frameless-slots')) return [];
            return Array.from(parentElement.childNodes);
        }
        
        function handleScriptLoad(e: Event) {
            if (e.target !== sentinel) return;
            const { shadowRoot } = element as HTMLUnknownElement;
            const shadow = shadowRoot!;
            
            $template.innerHTML = utilities.interpolate(innerHTML)(element.__state__);
            for (const child of slotted) element.appendChild(child);  // strongly-slotted content
            shadow.appendChild(styles);
            shadow.appendChild($template.content);
            element.removeEventListener('load', handleScriptLoad, true);
            module.remove();
            sentinel.remove();
        }
        
        styles.innerHTML = css;
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
