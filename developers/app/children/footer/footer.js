
import { $ } from '/developers/app/core.js';

const { log } = console;

$.set(class Test {
    bootstrap = ($) => this.$ = $;
    handleEvent(e) {}
    
});
