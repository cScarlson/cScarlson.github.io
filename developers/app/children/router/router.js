
import { frameless } from '/developers/frameless.js';
import { $ } from '/developers/app/core.js';
import { Route } from './route.js';

const { log } = console;
const ROOT = '/developers';

$.set('router', 'error', class Test {
    iframe = document.createElement('iframe');
    container = document.createElement('div');
    detail = {};
    
    constructor($) {
        const { iframe } = this;
        const { target } = $;
        const container = target.querySelector('.app.router .router.content');
        
        iframe.setAttribute('partial', '');
        this.$ = $;
        this.container = container;
        target.addEventListener('hook:ready', this, true);
        Route.attach(this);
    }
    
    render({ uri, data }) {
        log(data, data, data);
        const { iframe, container } = this;
        const clone = iframe.cloneNode(true);
        
        this.detail = data;
        clone.src = uri;
        container.innerHTML = '';
        container.appendChild(clone);
        setTimeout(x => frameless.process(clone), 450);
    }
    
    call(router, state) {
        if (!state?.route?.target) return;
        const { route, params, routes } = state;
        const { id, target } = route;
        const { data } = route;
        const uri = `${ROOT}/${target}`;
        
        log(`@ROUTER`, state);
        this.render({ uri, data });
    }
    
    handleEvent(e) {
        if (`${e.type}:${e.target.className}` === 'hook:ready:app article') return this.handleCloneLoad(e);
        const { $ } = this;
        const { target } = e;
        log(`@Router.handleEvent`, e.type, e.target, e.target.className);
    }
    
    handleCloneLoad(e) {  // ALWAYS FIRES AFTER this.call
        const { detail } = this;
        const { type, target } = e;
        const event = new CustomEvent('router:data', { detail });
        
        log(`@CLONE-LOAD`, e.type, e.target);
        target.dispatchEvent(event);
    }
    
});
