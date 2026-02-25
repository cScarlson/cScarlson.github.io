
import type { ToDo } from '@asxs/core/types';
import { customElement, CustomElement } from '@asxs/core';
import { type State } from '@asxs/core/router';
import { default as template } from './example.element.html?raw';
import { default as styles } from './example.element.css?raw';


const { log, warn, error: err } = console;

export const TAGNAME = 'as-catalog-example';
export @customElement(TAGNAME) class CatalogExampleElement extends CustomElement {
    get __state__() {
        return {};
    }
    
    connectedCallback( x = super.connectedCallback() ): void {
        log(`@${TAGNAME}`);
    }
    
    render(): string {
        return `
            <style>${styles}</style>
            ${template}
        `;
    }
    
};
