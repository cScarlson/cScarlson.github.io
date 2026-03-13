
import { CustomElement, customElement } from '@asxs/core';
import { default as template } from './app.element.html?raw';
import { default as styles } from './app.element.css?raw';
import '@asxs/core/router';
import '@app/core/router';

const { log } = console;

export const TAGNAME = 'as-app';
export @customElement(TAGNAME) class AppElement extends CustomElement {
    static observedAttributes: string[] = [ 'test' ];
    get ['as:state']() {
        return { hero: '', speed: 'quick', animal: 'dog' };
    }
    
    [`attr:test`](val: string) {
        log(`@app.attr.test`, val);
    }
    
    connectedCallback( x = super.connectedCallback() ) {
        log(`CONNECTED!...`, );
    }
    
    createRenderRoot(): ShadowRoot | HTMLElement {
        return this;
    }
    
    render(): string {
        return `
            <style>${styles}</style>
            ${template}
        `;
    }
    
};
