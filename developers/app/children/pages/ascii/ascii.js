
import { $ } from '/developers/app/core.js';

const { log } = console;

$.set('ascii', class {
    
    handleEvent(e) {
        const { $ } = this;
        log(`@ASCII.handleEvent`, e.type, e.target, $);
        return e;
    }
    
});
