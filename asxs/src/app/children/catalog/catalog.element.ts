
import type { ToDo } from '@asxs/core/types';
import { customElement, CustomElement } from '@asxs/core';
import { type State } from '@asxs/core/router';
import { default as template } from './catalog.element.html?raw';
import { default as styles } from './catalog.element.css?raw';
import './children/catagory/catagory.element';

const { log, warn, error: err } = console;

export const TAGNAME = 'at-catalog';
export @customElement(TAGNAME) class CatalogElement extends CustomElement {
    get __state__() {
        const { state } = this;
        const { route } = state;
        const { id } = route;
        
        return { id };
    }
    
    constructor(private state: State) {
        super();
    }
    
    ['change:menu:item'](e: MouseEvent) {
        const { target } = e;
        const { id } = target as HTMLAnchorElement;
        log(`@MENU-ITEM-CHANGE`, id);
    }
    
    connectedCallback( x = super.connectedCallback() ): void {
        log(`@${TAGNAME}`);
        this.addEventListener('change', this as ToDo, true);
    }
    
    disconnectedCallback( x = super.disconnectedCallback() ): void {
        this.removeEventListener('change', this as ToDo, true);
    }
    
    render(): string {
        return `
            <style>${styles}</style>
            ${template}
        `;
    }
    
};
