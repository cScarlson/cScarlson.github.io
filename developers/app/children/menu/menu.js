
import { $ } from '/developers/app/core.js';

const { log } = console;
log(`@MENU #LOADED #SCRIPT`, $);

$.set('app-menu', 'click', class Menu {
    
    constructor($) {
        log(this.constructor.name, $);
    }
    
    handleEvent(e) {
        const { type, target } = e;
        log(`@Menu.handleEvent`, type, target);
    }
    
});
