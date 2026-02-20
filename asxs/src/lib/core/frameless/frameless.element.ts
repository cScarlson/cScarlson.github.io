
import type { ToDo } from '@asxs/core/types';
import type { RemoteElementDefinition } from '@asxs/core/element';
import { customElement } from '@asxs/core/customelement';
import { RemotelyDefinedElement } from './red.element';

const { log, warn, error: err } = console;

export const TAGNAME = 'as-frameless';
export @customElement(TAGNAME, { extends: 'iframe' }) class FramelessElement extends HTMLIFrameElement {
    #deferred: ToDo = (Promise as ToDo).withResolvers();
    
    constructor() {
        super();
        this.width = '0';  // ensure no iframe actually appears to user
        this.height = '0';  // ensure no iframe actually appears to user
        this.style.border = 'none';  // ensure no iframe actually appears to user
        this.style.display = 'none';  // ensure no iframe actually appears to user
    }
    
    #initialize = () => {
        const { contentDocument } = this as ToDo;
        const { attributes } = this;
        const { body: red } = contentDocument!;
        const { children } = red;
        const { [0]: meta, [1]: template, [2]: styles, [3]: script } = children as RemoteElementDefinition;  // RED (Remote Element Definition) protocol
        const container = new RemotelyDefinedElement({ meta, template, styles, script, attributes, contentDocument }, this);
        
        this.after(container);
    };
    
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
