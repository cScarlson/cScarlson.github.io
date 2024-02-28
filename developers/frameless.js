
import { default as utilities } from '/browserless/utilities/utilities.js';
import { $, config } from './app/core.js';

const { log, error: err } = console;
const ROOT_PATH = config.get('@root');
const attachments = new Map();
const replacements = new Map();
const frameless = (function start(document) {

    function boot(name, element) {
        const { tagName, events, Class, instance, event } = $.boot(name, element);
        const properties = attachments.get(element);
        
        instance.config = properties;
        attachments.delete(element);
    }
    
    function setup(script) {
        const { name, host } = this;
        
        function handleLoad(e) {
            if (e.target !== script) return;
            script.removeEventListener('load', handleLoad, true);
            boot(name, host);
        }
        
        host.addEventListener('load', handleLoad, true);
    }
    
    function slot(map, receiver, ...more) {
        if (!receiver) return;
        const { name = '' } = receiver;
        const nodes = map.has(name) ? map.get(name) : map.set(name, []).get(name);
        
        receiver.append(...nodes);
        if (more.length) return slot(map, ...more);
        return map;
    }

    function compile({ frame, metadata, sheets, scripts, template, templates, root, properties, attributes, children }) {
        const { name, attributes: attrs } = metadata;
        const { content } = template;
        const host = document.createElement(name);
        const slots = content.querySelectorAll('slot');
        const more = [ ...templates ].reduce( (a, t) =>  [ ...a, ...t.content.querySelectorAll('slot') ], []);
        const collection = [ ...slots, ...more ];
        const injections = [ ...children ].reduce(reduce, new Map());
        
        function reduce($, node) {
            const { slot = '' } = node;
            const existing = $.has(slot) ? $.get(slot) : $.set(slot, []).get(slot);
            return $.set(slot, [ ...existing, node ]);
        }
        
        for (let attr of attrs) host.attributes.setNamedItem( attr.cloneNode(true) );
        for (let { name, value } of attributes) host.setAttribute(name, value);
        slot(injections, ...collection);
        host.append(content, ...templates);
        
        return host;
    }
    
    function getAttributes(attrs) {
        const blacklist = new Set([ 'partial', 'src', 'root' ]);
        return attrs.filter( ({ name }) => !blacklist.has(name) );
    }
    
    function conceive(innerHTML) {
        const host = document.createElement('div');
        host.innerHTML = innerHTML;
        return host.childNodes;
    }
        
    function clone(node) {
        const { type } = this;
        
        if (type === 'link') return cloneLink(node);
        if (type === 'script') return cloneScript(node);
        return node.cloneNode(true);
    }
        
    function cloneLink(node) {
        if (node.tagName === 'STYLE') return node.cloneNode(true);
        const { href: url } = node;
        const { pathname } = new URL(url);
        const path = pathname.replace('/developers', '.');
        const clone = node.cloneNode(true);
        
        clone.rel = 'stylesheet';
        clone.href = path;
        
        return clone;
    }
        
    function cloneScript(node) {
        if (!node.src) return cloneInlineScript(node);
        const { type, src: url } = node;
        const { pathname } = new URL(url);
        const path = pathname.replace('/developers', '.');
        const clone = node.cloneNode(true);
        const actual = { 'partial': 'module' }[ type ];  // map to "module" by default
        
        clone.type = actual;
        clone.src = path;
        
        return clone;
    }

    function cloneInlineScript(node) {
        const { type } = node;
        const clone = node.cloneNode(true);
        const actual = { 'partial': 'module' }[ type ];  // map to "module" by default
        
        clone.type = actual;
        
        return clone;
    }
    
    function processDormant(partial, ...more) {
        if (!partial) return;
        const { pathname: root } = this;
        const uri = partial.getAttribute('src');
        const pathname = `${root}/${uri}`;
        
        if ( partial.hasAttribute('root') ) partial.setAttribute('src', `${ partial.getAttribute('root') }/${uri}`);
        else partial.setAttribute('src', pathname);
        if (more.length) processDormant.call(this, ...more);
    }
    
    function process(partial, ...more) {
        if (!partial?.isConnected) return;// log(`!partial?.isConnected`, partial);
        if ( replacements.has(partial.src) ) return partial.replaceWith( replacements.get(partial.src) ), log(`@cached`, partial.src);
        if ( !partial.contentDocument?.querySelector('meta') ) return log(`NO CONTENT`, partial);
        const { contentWindow, contentDocument, src, attributes: attrs, innerHTML, parentElement } = partial;
        const { href, origin, pathname, searchParams } = new URL(src);
        const { name, attributes: props } = contentDocument.querySelector('meta');
        const sheets = contentDocument.querySelectorAll('link[rel="partial"], style');
        const scripts = contentDocument.querySelectorAll('script[type="partial"]');
        const template = contentDocument.querySelector('template[type="partial"]') || document.createElement('template');
        const templates = contentDocument.querySelectorAll('template:not([type="partial"])');
        const fragment = template.content;
        const partials = fragment.querySelectorAll(`iframe[partial]`);
        const segments = pathname.split('/');
        const filename = segments.pop();
        const reformed = segments.join('/');
        const metadata = { name: 'div', name, attributes: props };
        const url = new URL(`${origin}${reformed}`);
        const properties = (searchParams);
        const attributes = getAttributes([ ...attrs ]);
        const children = conceive(innerHTML);
        const styles = [ ...sheets ].map(clone.bind({ type: 'link' }));
        const javascripts = [ ...scripts ].map(clone.bind({ type: 'script' }));
        const host = compile({ frame: partial, metadata, sheets, scripts, template, templates, root: reformed, properties, attributes, children });
        const subject = new HostSubject(host);
        const ready = new CustomEvent('hook:ready', { detail: {} });
        
        function observe({ host, mutation }) {
            subject.detach(observe);
            process.call(url, ...more);
        }
        
        function handleHostSubtreeLoad(e) {
            if (!e.target?.matches) return;
            if ( !e.target.matches('iframe[partial]') ) return;
            const { target: partial } = e;
            
            process.call(url, partial);
        }
        
        processDormant.call(url, ...partials);
        host.setAttribute('data-src', reformed);
        subject.attach(observe);
        subject.connect(parentElement);
        host.addEventListener('load', handleHostSubtreeLoad, true);
        attachments.set(host, properties);
        javascripts.forEach( setup.bind({ name, host }) );
        host.append(...javascripts);
        host.append(...styles);
        partial.replaceWith(host);
        setTimeout(x => host.dispatchEvent(ready), 100);
        replacements.set(partial.src, host);
    }
    
    function onLoad(e) {
        if (e.target.readyState !== 'complete') return;
        const { location } = window;
        const partials = document.querySelectorAll('iframe[partial]');
        
        if (partials.length) process.call(location, ...partials);
    }
    
    class HostSubject {  // USE MUTATION OBSERVER TO FIX THE TIMEOUT CRAP ONCE & FOR ALL
        observers = new Set();
        
        constructor(host) {
            const observer = new MutationObserver(this.observe);
            this.host = host;
            this.observer = observer;
        }
        
        observe = (mutations, observer) => {
            for (const mutation of mutations) if (mutation.type in this) this[mutation.type](mutation);
        };
        
        connect(target) {
            const { observer } = this;
            observer.observe(target, { childList: true });
            return this;
        }
        
        disconnect() {
            const { observer } = this;
            observer.disconnect();
            return this;
        }
        
        ['childList'](mutation) {
            const { host } = this;
            const { addedNodes } = mutation;
            for (let node of addedNodes) if (node === host) this.notify({ host, mutation });
        }
        
        attach(observer) {
            const { observers } = this;
            observers.add(observer);
            return this;
        }
        
        detach(observer) {
            const { observers } = this;
            observers.delete(observer);
            return this;
        }
        
        notify(state) {
            const { observers } = this;
            observers.forEach( observer => observer.call(this, state) );
            return this;
        }
        
    }
    
    if (document.readyState !== 'complete') document.addEventListener('readystatechange', onLoad, true);
    else onLoad({ type: 'manual', target: document });
    
    
    return {
        start,
        process,
    };
})(document);

export { frameless };
