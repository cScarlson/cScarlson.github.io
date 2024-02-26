
import { $ } from '/developers/app/core.js';

const { log } = console;

$.set('ascii:searchbar', 'load', 'click', 'input', 'error', class {
    
    constructor($) {
        this.$ = $;
    }
    
    handleEvent(e) {
        const { $ } = this;
        const { type, target } = e;
        const { className } = target;
        const action = `${type}:${className}`;
        const handle = {
            'input:searchbar control input search': this.handleInput,
        }[ action ];
        
        if (handle) handle.call(this, e);
        else log(`@ASCII/searchbar.handleEvent`, e.type, e.target);
        
        return e;
    }
    
    handleInput(e) {
        if (!e.target.value) return this.$.publish('ASCII:SEARCH:QUERY', { query: '' });
        if (e.target.value.length < 3) return;
        const { $ } = this;
        const { target } = e;
        const { value: query } = target;
        
        $.publish('ASCII:SEARCH:QUERY', { query });
    }
    
});
