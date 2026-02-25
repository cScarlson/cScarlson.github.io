
import type { ToDo } from '@asxs/core/types';
import { customElement } from '@asxs/core';
import { default as styles } from './stateful.element.css?raw';

const { log } = console;

export const TAGNAME = 'as-stateful';
export @customElement(TAGNAME) class StatefulElement extends HTMLElement {
    
    constructor() {
        super();
        const { innerHTML: content } = this;
        const style = `<style>${styles}</style>`;
        const innerHTML = `${style}\n${content}`;
        
        this.innerHTML = innerHTML;
    }
    
};
