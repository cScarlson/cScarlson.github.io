
import { $ } from '/developers/app/core.js';

const { log } = console;

$.set('footer', class Test {
    bootstrap = ($) => this.$ = $;
    handleEvent(e) {}
    
});
