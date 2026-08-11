
import { $, CustomElement } from '/websites/core/core.js';

const { log } = console;

$('csc-menu-desktop', class extends CustomElement {
    
    constructor() {
        super({ templateURL: '/websites/app/children/header/children/menu/desktop/desktop.component.html', styleURL: '/websites/app/children/header/children/menu/desktop/desktop.component.css' });
    }
    
    async connectedCallback() {
        const content = {
            'MENU:ACTION:HOME': await $.translate('MENU:ACTION:HOME'),
            'MENU:ACTION:ABOUT': await $.translate('MENU:ACTION:ABOUT'),
            'MENU:ACTION:PRICING': await $.translate('MENU:ACTION:PRICING'),
            'MENU:ACTION:CONTACT': await $.translate('MENU:ACTION:CONTACT'),
            'MENU:ACTION:SERVICES': await $.translate('MENU:ACTION:SERVICES'),
            'MENU:ACTION:MORE': await $.translate('MENU:ACTION:MORE'),
        };
        
        this.content = content;
        return await super.connectedCallback();
    }
    
});
