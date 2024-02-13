
import { $ } from '/developers/app/core.js';

const { log } = console;

$.set('load', 'click', 'focus', 'error', class Test {
    static selector = 'h2[x="true"]';
    
    constructor($) {
        const { name: data } = window;
        
        // log(`@Test.constructor`, $.publish.name, data, location.search);
        // document.addEventListener('load', function handleLoad(e) {
        //     if (e.target.tagName !== 'IFRAME') return;
        //     log(`iframe onload`, e.type, e);
        //     document.removeEventListener('load', handleLoad, true);
        // }, true);
    }
    
    bootstrap = ($) => this.$ = $;
    
    handleEvent(e) {
        const { $ } = this;
        const { target } = e;
        log(`@Router.handleEvent`, e.type, e.target, $);
        // if (target.tagName && target.matches('iframe.app.router')) setTimeout(function x() {
        //     const html = `<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><hr />`;
        //     target.after(`${html}${html}${html}${html}${html}${html}${html}${html}${html}${html}`);
        //     setTimeout(x, 5_000);
        // }, 5_000);
        return e;
    }
    
}).bind(window, document);
