
import { $ } from '/developers/app/core.js';

const { log } = console;

$.set('{component-name}', 'load', 'click', 'focus', class {
    
    constructor($) {}
    
    handleEvent(e) {
        const { $ } = this;
        log(`@Example.handleEvent`, e.type, e.target, $);
    }
    
});
