
import type { ToDo } from '@asxs/core/types';
import { customElement, CustomElement } from '@asxs/core/element';

const { log } = console;

export const TAGNAME = 'at-route';
export @customElement(TAGNAME) class Route extends CustomElement {
    #content: string = this.innerHTML;  // allows 'slotted' injections as standard child elements
    initial: string = '#/';
    
    constructor() {
        super();
        const { origin, href, hash } = location;
        // location.hash = '/';
        // location.assign('#/');
        // setTimeout(x => location.hash = '/', 1_000 * 0);
        // setTimeout(x => location.hash = hash, 1_000 * 0.5);
    }
    
    createRenderRoot(): ShadowRoot | HTMLElement {
        return this;
    }
    
    render(): string {
        return `
            <style>
                ${this.tagName} {
                    display: none;
                    &:target, &:has(:target), &:has(:target) :target {
                        display: block;
                    }
                    &:has([id="${this.initial}"]) {
                        border: solid 10px cyan;
                        display: block;
                    }
                }
            </style>
            ${this.#content}
        `;
    }
    
};
