
import { $, CustomElement } from '/src/core/core.js';

const { log } = console;

$('csc-about', class extends CustomElement {
    
    constructor() {
        super({ templateURL: '/src/app/children/about/about.component.html', styleURL: '/src/app/children/about/about.component.css' });
    }
    
    async connectedCallback() {
        const content = {
            'ABOUT:TITLE': await $.translate('ABOUT:TITLE'),
            'ABOUT:CONTENT': await $.translate('ABOUT:CONTENT'),
            'CTA:CONTACT': await $.translate('CTA:CONTACT'),
            'CTA:PACKAGES': await $.translate('CTA:PACKAGES'),
        };
        
        this.content = content;
        return await super.connectedCallback();
    }
    
});
