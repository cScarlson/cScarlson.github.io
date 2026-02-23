
import { customElement, CustomElement } from '@asxs/core';
import { type State } from '@asxs/core/router';
import { default as template } from './catagory.element.html?raw';
import { default as styles } from './catagory.element.css?raw';

const { log, warn, error: err } = console;

export const TAGNAME = 'as-catagory';
export @customElement(TAGNAME) class CatagoryElement extends CustomElement {
    
    connectedCallback( x = super.connectedCallback() ) {
        log(`@${TAGNAME}`);
    }
    
    render(): string {
        return `
            <style>${styles}</style>
            ${template}
        `;
    }
    
};
