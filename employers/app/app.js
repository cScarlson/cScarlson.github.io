
import { default as utilities } from '/browserless/utilities/utilities.js';
import { Broadcast } from '/developers/app/core/broadcast.js';

const { console, fetch, marked } = window;
const { log } = console;
const broadcast = new Broadcast('DEMO:BROADCAST:MESSAGE');

log(`LOADED APP.JS`);

function $(name, Handler, ...events) {
    
    function handleDocReady(e) {
        const elements = document.getElementsByTagName(name);
        const instances = [].reduce.call(elements, bootstrap, []);
        window.removeEventListener('load', handleDocReady, true);
    }
    
    function bootstrap(instances, element) {
        const sandbox = new Sandbox(element);
        const instance = new Handler(sandbox);
        const event = new CustomEvent('hook:ready', { detail: { callback } });
        
        function callback({ type, target: element, detail }) {
            events.forEach( type => element.addEventListener(type, instance, true) );
        }
        
        element.addEventListener('hook:ready', instance, true);
        events.forEach( type => element.addEventListener(type, instance, true) );
        element.dispatchEvent(event);
        
        return [ ...instances, instance ];
    }
    
    if (document.readyState === 'complete') handleDocReady({ type: 'manual', target: document });
    else window.addEventListener('load', handleDocReady, true);
}

class Sandbox {}

$('app', class {
    markdown = fetch('./app/cover.letter.md').then( res => res.text() );
    template = fetch('./app/app.html').then( res => res.text() );
    resize = utilities.debounce( e => this.rehash(location), 500 );
    
    constructor($) {
        log(`@app`, this);
        location.hash = '/';
        setTimeout(x => (location.hash === '#/') ? location.hash = '#/app/sections/about' : '', 5_000);
        window.addEventListener('resize', this, true);
        broadcast.subscribe('DEMO:BROADCAST:MESSAGE', this);
    }
    
    rehash({ hash, pre = '/noop' }, delay = 0) {
        location.hash = pre;
        location.hash = hash;
    }
    
    handleEvent(e) {
        if (e.type === 'DEMO:BROADCAST:MESSAGE') return this.handleBroadcast(e);
        if (e.type === 'hook:ready') return this.handleReady(e);
        if (e.type === 'resize') return this.resize(e);
        const { type, target } = e;
        const { className } = target;
        const action = `${type}:${className}`;
        const handler = {
            'submit:app login': this.handleFormSubmission,
        }[ action ];
        
        if (handler) handler.call(this, e);
        else log(`@App.handleEvent`, e.type, e);
    }
    
    async handleReady(e) {
        const { markdown: readme } = this;
        const { template: promise } = this;
        const { target, detail } = e;
        const { parentElement: parent } = target;
        const { callback } = detail;
        const coverletter = await readme;
        const template = await promise;
        const letter = marked.parse(coverletter);
        const interpolated = utilities.interpolate(template)({ letter });
        const html = `<app class="app container">${interpolated}</app>`;
        const event = new CustomEvent('hook:replaced', { detail: '' });
        
        target.outerHTML = html;
        callback({
            type: 'replacement',
            target: parent.querySelector('app.app.container')
        })
    }
    
    handleFormSubmission(e) {
        e.preventDefault();
        window.location.reload();
    }
    
    handleBroadcast(e) {
        const confirmed = window.confirm(e.data.message);
        if (confirmed || !confirmed) window.close('', '_self', '');
    }
    
}, 'submit', 'click', 'resize');
