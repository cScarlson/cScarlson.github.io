
import { $ } from '/developers/app/core.js';

const { log } = console;

$.set('feature', class {
    
    constructor($) {
        const { target } = $;
        this.$ = $;
    }
    
    handleEvent(e) {
        if (e.type === 'hook:ready') return this.handleReady(e);
    }
    
    handleReady(e) {
        if (e.target !== this.$.target) return;
    }
    
});
