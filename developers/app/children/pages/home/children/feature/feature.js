
import { $ } from '/developers/app/core.js';

const { log } = console;

$.set('feature', class {
    get position() { return this.config.get('position') }
    
    constructor($) {
        const { target } = $;
        log(`@Feature`, this);
        this.$ = $;
    }
    
    handleEvent(e) {
        if (e.type === 'hook:ready') return this.handleReady(e);
    }
    
    handleReady(e) {
        if (e.target !== this.$.target) return;
        log(`REEADYYYYY`, e.target, this.position);
    }
    
});
