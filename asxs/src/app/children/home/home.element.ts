
import { customElement } from '@asxs/core';
import { Route } from '@asxs/core/router';
import { default as hero } from './children/hero/hero.red.html?url';
import { default as hook } from './children/example/button.red.html?url';
import { default as frameless } from './children/frameless/frameless.red.html?url';
import { default as xs } from './children/xs/xs.red.html?url';
import { default as extensible } from './children/extensible/extensible.red.html?url';
import { default as excess } from './children/excess/excess.red.html?url';
import { default as accessibility } from './children/accessible/accessible.red.html?url';
import { default as css } from './children/css/css.red.html?url';
import { default as js } from './children/js/js.red.html?url';
import { default as ts } from './children/ts/ts.red.html?url';
import { default as template } from './home.element.html?raw';
import { default as styles } from './home.element.css?raw';

const { log, warn, error: err } = console;

export const TAGNAME = 'at-home';
export @customElement(TAGNAME) class HomeElement extends Route {
    get ['as:state']() {
        return {
            hero,
            hook,
            frameless,
            xs,
            extensible,
            excess,
            accessibility,
            css,
            js,
            ts,
        };
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
