
import { $ } from '/developers/app/core.js';
import { default as utilities } from '/browserless/utilities/utilities.js';

const { log } = console;

$.set('broadcast', 'submit', class {
    template = '';
    get name() { return this.config.get('name') }
    get doc() { return this.config.get('doc') }
    
    constructor($) {
        const { target } = $;
        this.$ = $;
        this.template = target.querySelector('template.broadcast.article').innerHTML;
    }
    
    handleEvent(e) {
        if (e.type === 'hook:ready') return this.handleReady(e);
        if (e.type === 'submit') return this.handleSubmit(e);
        log(`@Broadcast.handleEvent`, e.type, e, this.config);
    }
    
    handleReady(e) {
        if (e.target !== this.$.target) return;
        const { $, template, name, doc } = this;
        const { target } = $;
        const config = new URLSearchParams({ name, doc });
        const html = utilities.interpolate(template)({ config });
        
        target.firstElementChild.innerHTML = html;
    }
    
    handleSubmit(e) {
        const { $ } = this;
        const { type, target } = e;
        const form = new FormData(target);
        const data = Object.fromEntries(form);
        
        window.open('/employers', 'name_your_window', 'location=1,status=1,scrollbars=1,resizable=no,width=360,height=400,menubar=no,toolbar=no');
        
        setTimeout(x => $.publish('DEMO:BROADCAST:MESSAGE', data), 3_000);
        e.preventDefault();
    }
    
});
