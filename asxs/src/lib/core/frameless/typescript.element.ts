
import type { ToDo } from '@asxs/core/types';
import { customElement } from '@asxs/core/customelement';

const { log, warn, error: err } = console;

export const TAGNAME = 'as-typescript';
export @customElement(TAGNAME, { extends: 'script' }) class TypeScriptElement extends HTMLScriptElement {
    
    #compile(typescript: string) {
        warn(`@${this.constructor.name} Error ("${TAGNAME}"): TypeScript compilation is not yet supported.`);
        return `${typescript}\n\n // TYPESCRIPT NOT YET SUPPORTED`;
    }
    
    connectedCallback() {
        const { innerHTML: typescript } = this;
        const javascript = this.#compile(typescript);
        this.innerHTML = javascript;
    }
    
    disconnectedCallback() {}
    
};
