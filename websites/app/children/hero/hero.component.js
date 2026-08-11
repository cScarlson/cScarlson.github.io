
import { $, CustomElement } from '/websites/core/core.js';

const { log } = console;

$('csc-hero', class extends CustomElement {
    
    constructor() {
        super({ templateURL: '/websites/app/children/hero/hero.component.html', styleURL: '/websites/app/children/hero/hero.component.css' });
    }
    
    async connectedCallback() {
        const content = {
            'HERO:TITLE': await $.translate('HERO:TITLE'),
            'HERO:SUBTITLE': await $.translate('HERO:SUBTITLE'),
            'HERO:CONTENT': await $.translate('HERO:CONTENT'),
            'CTA:CONTACT': await $.translate('CTA:CONTACT'),
            'CTA:SERVICES': await $.translate('CTA:SERVICES'),
        };
        
        this.content = content;
        return await super.connectedCallback();
    }
    
});
