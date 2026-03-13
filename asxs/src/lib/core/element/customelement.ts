
import type { ToDo } from '@asxs/core/types';

const { log } = console;

export function customElement(tagName: string, options?: ElementDefinitionOptions | undefined) {
    
    return function decorate(Class: any) {
        if ( customElements.get(tagName) ) return Class;
        customElements.define(tagName, Class, options);
        return Class;
    };
};
