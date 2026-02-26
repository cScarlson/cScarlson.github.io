
import type { ToDo } from '@asxs/core/types';
import { customElement, CustomElement } from '@asxs/core';
import { default as template } from './magazine.element.html?raw';
import { default as styles } from './magazine.element.css?raw';


const { log, warn, error: err } = console;

export const TAGNAME = 'as-catalog-magazine';
export @customElement(TAGNAME) class CatalogMagazineElement extends CustomElement {
    get ['as:state']() {
        return {};
    }
    
    connectedCallback( x = super.connectedCallback() ): void {
        log(`@${TAGNAME}`);
    }
    
    createRenderRoot(): ShadowRoot | HTMLElement {
        return this;
    }
    
    render(): string {
        return `
            <style>${styles}</style>
            ${template}
        `;
    }
    
};
