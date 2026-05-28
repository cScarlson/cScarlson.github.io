
import type { ToDo } from '@asxs/core/types';
import { customElement, CustomElement } from '@asxs/core';
import { default as template } from './404.element.html?raw';
import { default as styles } from './404.element.css?raw';

const { log, warn, error: err } = console;

export const TAGNAME = 'at-404';
export @customElement(TAGNAME) class Four04Element extends CustomElement {
    get ['as:state']() {
        const { state } = this;
        const { route } = state;
        const { id } = route;
        
        return { id };
    }
    
    constructor(private state: ToDo) {
        super();
    }
    
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
