
import type { ToDo } from '@asxs/core/types';
import { customElement, CustomElement } from '@asxs/core';
import { type State } from '@asxs/core/router';
import { markdown, utilities } from '@asxs/core/utilities';
import { types, basic, sizes, block, checkbox, radio, file, reflect } from '@asxs/button';
import { default as template } from './catalog.element.html?raw';
import { default as styles } from './catalog.element.css?raw';
import './children/catagory/catagory.element';

const { log, warn, error: err } = console;
const documentation = {
    buttons: {
        types: utilities.interpolate( markdown.parse(types.docs) )({
            element: types.example,
            example: markdown.escapeHTML(types.example)
        }),
        basic: utilities.interpolate( markdown.parse(basic.docs) )({
            element: basic.example,
            example: markdown.escapeHTML(basic.example)
        }),
        sizes: utilities.interpolate( markdown.parse(sizes.docs) )({
            element: sizes.example,
            example: markdown.escapeHTML(sizes.example)
        }),
        block: utilities.interpolate( markdown.parse(block.docs) )({
            element: block.example,
            example: markdown.escapeHTML(block.example)
        }),
        checkbox: utilities.interpolate( markdown.parse(checkbox.docs) )({
            element: checkbox.example,
            example: markdown.escapeHTML(checkbox.example)
        }),
        radio: utilities.interpolate( markdown.parse(radio.docs) )({
            element: radio.example,
            example: markdown.escapeHTML(radio.example)
        }),
        file: utilities.interpolate( markdown.parse(file.docs) )({
            element: file.example,
            example: markdown.escapeHTML(file.example)
        }),
        reflect: utilities.interpolate( markdown.parse(reflect.docs) )({
            element: reflect.example,
            example: markdown.escapeHTML(reflect.example)
        }),
    },
};

export const TAGNAME = 'at-catalog';
export @customElement(TAGNAME) class CatalogElement extends CustomElement {
    get __state__() {
        const { state } = this;
        const { route } = state;
        const { id } = route;
        
        return { id, ...documentation };
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
