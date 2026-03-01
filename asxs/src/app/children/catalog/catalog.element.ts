
import type { ToDo } from '@asxs/core/types';
import { customElement, CustomElement, ElementCrawler } from '@asxs/core';
import { type State } from '@asxs/core/router';
import { menuitems, documentation } from './core/content';
import { default as template } from './catalog.element.html?raw';
import { default as styles } from './catalog.element.css?raw';
import './children/documentation/documentation.element';

const { log, warn, error: err } = console;
const LANDING_TAB = 'as:query:popovers';

export const TAGNAME = 'at-catalog';
export @customElement(TAGNAME) class CatalogElement extends CustomElement {
    ['as:crawler']: ElementCrawler = new ElementCrawler(this);
    [LANDING_TAB]: HTMLInputElement = document.createElement('input');
    get ['as:state']() {
        const { state } = this;
        const { route } = state;
        const { id } = route;
        
        return { id, menuitems, documentation };
    }
    
    constructor(private state: State) {
        super();
    }
    
    ['change:menu:item'](e: MouseEvent) {
        const { target } = e;
        const { id } = target as HTMLElement;
        const element = this.querySelector(`.content.section.control[id="${id}"]`) as HTMLElement;
        
        log(`@MENU-ITEM-CHANGE`, id, element);
        // element.scrollIntoView({ behavior: 'smooth' });
    }
    
    ['as:update:handler'](content: string) {
        const { [LANDING_TAB]: control } = this;
        control.checked = true;
    }
    
    connectedCallback( x = super.connectedCallback() ): void {
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
