
import { $, CustomElement } from '/src/core/core.js';

const { log } = console;

$('csc-footer', class extends CustomElement {
    
    constructor() {
        super({ templateURL: '/src/app/children/footer/footer.component.html', styleURL: '/src/app/children/footer/footer.component.css' });
    }
    
    async connectedCallback() {
        const content = {
            'FOOTER:TITLE': await $.translate('FOOTER:TITLE'),
            'MENU:ACTION:HOME':await $.translate('MENU:ACTION:HOME'),
            'MENU:ACTION:SERVICES':await $.translate('MENU:ACTION:SERVICES'),
            'MENU:ACTION:PRICING':await $.translate('MENU:ACTION:PRICING'),
            'MENU:ACTION:CONTACT':await $.translate('MENU:ACTION:CONTACT'),
            'MENU:ACTION:ABOUT':await $.translate('MENU:ACTION:ABOUT'),
            'FOOTER:ACTION:EMPLOYERS':await $.translate('FOOTER:ACTION:EMPLOYERS'),
            'FOOTER:ACTION:DEVELOPERS':await $.translate('FOOTER:ACTION:DEVELOPERS'),
            'FOOTER:COPYRIGHT': await $.translate('FOOTER:COPYRIGHT'),
            'CTA:CONTACT': await $.translate('CTA:CONTACT'),
        };
        
        this.content = content;
        return await super.connectedCallback();
    }
    
});
