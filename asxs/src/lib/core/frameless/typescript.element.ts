
import type { ToDo } from '@asxs/core/types';
import { customElement } from '@asxs/core/customelement';

const { parent } = window;
// const { HTMLScriptElement } = parent as any;
const { log } = console;

log(`@as-typescript -> LOADED`);

export const TAGNAME = 'as-typescript';
export @customElement(TAGNAME, { extends: 'script' }) class TypeScriptElement extends HTMLScriptElement {
    
    constructor() {
        super();
        log(`@${TAGNAME}`, this.innerHTML);
    }
    
    #handleLoad(e: Event) {}
    
    handleEvent(e: Event) {}
    
    connectedCallback() {
        log(`@${this.constructor.name}`, TAGNAME, this.innerText);
    }
    
    disconnectedCallback() {}
    
};
