
import { $, CustomElement } from '/src/core/core.js';

const { log } = console;

$('csc-menu-mobile', class extends CustomElement {
    
    constructor() {
        super({ templateURL: '/src/app/children/header/children/menu/mobile/mobile.component.html', styleURL: '/src/app/children/header/children/menu/mobile/mobile.component.css' });
        this.$shadow.addEventListener('close', this, true);
        this.$shadow.addEventListener('click', this, true);
        $.subscribe('MENU:REQUEST:SHOW', this);
        $.subscribe('MENU:REQUEST:HIDE', this);
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
    
    show(e) {
        const { $shadow, dialog: modal } = this;
        const dialog = modal ? modal : $shadow.querySelector('.app.menu.mobile');
        
        dialog.show();
        this.dialog = dialog;
    }
    
    hide(e) {
        const { $shadow, dialog: modal } = this;
        const dialog = modal ? modal : $shadow.querySelector('.app.menu.mobile');
        
        dialog.close();
        this.dialog = dialog;
    }
    
    handleEvent(e) {
        if (e.type === 'MENU:REQUEST:SHOW') return this.show(e);
        if (e.type === 'MENU:REQUEST:HIDE') return this.hide(e);
        if (e.type === 'close') return this.handleClose(e);
        if (e.type === 'click') return this.handleClick(e);
    }
    
    handleClose(e) {
        this.hide(e);
        $.publish('MENU:CLOSED');
    }
    
    handleClick(e) {
        if ( !e.target.matches('.item.control') ) return;
        this.handleClose(e);
    }
    
});
