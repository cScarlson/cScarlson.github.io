
import { $ } from '/developers/app/core.js';
import { Sandbox } from '/developers/app/sandbox.js';

const { log } = console;
const sandbox = new Sandbox({});

sandbox.subscribe('back', function x(e) {
    log(`@child-iframe`, e.type, e.data);
});
// sandbox.subscribe('back-child', function x(e) {
//     log(`@child-iframe`, e.type, e.data);
// });
setTimeout(function timeout() {
    sandbox.publish('child', { src: 'child-iframe' });
}, 9_000);

$.set('load', 'click', 'focus', class Child {
    static selector = 'h2[x="true"]';
    
    constructor() {
        const { name: data } = window;
        log(`@Child.constructor`, data, location.search);
    }
    
    handleEvent(e) {
        log(`@Child.handleEvent`, e.type, e.target);
        return e;
    }
    
}).bind(window, document);
