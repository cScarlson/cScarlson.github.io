
import { $, CustomElement } from '/src/core/core.js';

const { log } = console;

$('csc-menu-icon', class extends CustomElement {
    
    constructor() {
        super({ templateURL: '/src/app/children/header/children/menu/icon/icon.component.html', styleURL: '/src/app/children/header/children/menu/icon/icon.component.css' });
        this.addEventListener('click', e => $.publish('HEADER:MENU:CLICK'), true);
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
