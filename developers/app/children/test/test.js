
import { $ } from '/developers/app/core.js';
import { Sandbox } from '/developers/app/sandbox.js';

const { log } = console;
const sandbox = new Sandbox({});

log(`@TEST#running...`);
sandbox.subscribe('back', function x(e) {
    log(`@test-iframe`, e.type, e.data);
});
// setTimeout(function timeout() {
//     sandbox.publish('test', { src: 'test-iframe' });
// }, 3_000);

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
