
import { $ } from '/developers/app/core.js';

const { log } = console;

$.set('load', 'click', 'focus', class Test {
    static selector = 'h2[x="true"]';
    
    constructor($) {
        const { name: data } = window;
        
        log(`@Test.constructor`, $.publish.name, data, location.search);
        document.addEventListener('load', function handleLoad(e) {
            if (e.target.tagName !== 'IFRAME') return;
            log(`iframe onload`, e.type, e);
            document.removeEventListener('load', handleLoad, true);
        }, true);
    }
    
    bootstrap = ($) => this.$ = $;
    
    handleEvent(e) {
        const { $ } = this;
        log(`@Test.handleEvent`, e.type, e.target, $);
        return e;
    }
    
}).bind(window, document);
