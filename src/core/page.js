
import { CustomElement } from './custom.element.js';

const { log } = console;

export class Page extends CustomElement {
    static observedAttributes = [ ];
    
    constructor(options) {
        super({ templateURL: './page.component.html', styleURL: './page.component.css', ...options });
    }
    
}
