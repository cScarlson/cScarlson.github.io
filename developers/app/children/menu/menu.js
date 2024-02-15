
import { $ } from '/developers/app/core.js';

const { log } = console;

$.set('app-menu', 'change', class Menu {
    
    constructor($) {
        const { target } = $;
        const { content } = target.querySelector('template#navs');
        const control = target.querySelector('.menu.facade');
        const navs = content.querySelector('.header.menu');
        
        this.$ = $;
        this.control = control;
        this.navs = navs;
        
        $.subscribe('MENU:DISMISSED', this);
    }
    
    handleEvent(e) {
        if (e.type === 'MENU:DISMISSED') return this.handleDismiss(e);
        const { type, target } = e;
        const { className } = target;
        const action = `${type}:${className}`;
        const handle = {
            'change:menu facade': this.handleMenuControl,
        }[ action ];
        
        if (handle) handle.call(this, e);
        else log(`@Menu.handleEvent`, type, target);
    }
    
    handleMenuControl(e) {
        const { $, navs } = this;
        const { target } = e;
        const { checked: active } = target;
        const { outerHTML: content } = navs;
        
        $.publish('MENU:ACTION', { id: 'app:menu', active, content });
    }
    
    handleDismiss(e) {
        const { control } = this;
        control.checked = false;
    }
    
});
