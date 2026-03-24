
import type { ToDo } from '@asxs/core/types';
import { customElement, CustomElement } from '@asxs/core/element';

export const TAGNAME = 'at-route';
export @customElement(TAGNAME) class Route extends CustomElement {
    #content: string = this.innerHTML;  // allows 'slotted' injections as standard child elements
    get path(): string { return this.getAttribute('path') as ToDo }
    get identifier(): string { return this.parentElement instanceof Route ? `${this.parentElement.identifier}/${this.path}` : '#' }
    
    createRenderRoot(): ShadowRoot | HTMLElement {
        return this;
    }
    
    render(): string {
        return `
            <style>
                ${this.tagName} {
                    display: none;
                    &:target, &:has(:target) {
                        display: block;
                    }
                }
            </style>
            ${this.#content}
        `;
    }
    
};
