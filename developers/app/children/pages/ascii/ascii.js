
import { $ } from '/developers/app/core.js';

const { log } = console;

$.set('load', 'click', 'focus', class Test {
    
    handleEvent(e) {
        const { $ } = this;
        // log(`@Test.handleEvent`, e.type, e.target, $);
        return e;
    }
    
});
