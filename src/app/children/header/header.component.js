
import { $, CustomElement } from '/src/core/core.js';
import './children/menu/desktop/desktop.component.js';
import './children/menu/icon/icon.component.js';

const { log } = console;

$('csc-header', class extends CustomElement {
    
    constructor() {
        super({ templateURL: '/src/app/children/header/header.component.html', styleURL: '/src/app/children/header/header.component.css' });
    }
    
    async connectedCallback() {
        const content = {
            'BRAND:ACRO': await $.translate('BRAND:ACRO'),
            'BRAND:NAME': await $.translate('BRAND:NAME'),
        };
        
        this.content = content;
        return await super.connectedCallback();
    }
    
});
