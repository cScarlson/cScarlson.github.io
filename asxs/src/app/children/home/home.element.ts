
import { customElement, CustomElement } from '@asxs/core';
import { Route, type State } from '@asxs/core/router';
import { default as hero } from './children/hero/hero.red.html?url';
import { default as template } from './home.element.html?raw';
import { default as styles } from './home.element.css?raw';

const { log, warn, error: err } = console;

export const TAGNAME = 'at-home';
export @customElement(TAGNAME) class HomeElement extends Route {
    get ['as:state']() {
        return { hero };
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
