
import { default as utilities } from '/browserless/utilities/utilities.js';
import { $, config } from './app/core.js';

const { log } = console;
const ROOT_PATH = config.get('@root');
const frameless = (function start(document) {

    function boot(name, element) {
        $.boot(name, element);
    }
    
    function setup(script) {
        const { name, host } = this;
        const uuid = utilities.uuid();
        
        function handleLoad(e) {
            e.target.removeAttribute('id');
            script.removeEventListener('load', handleLoad, true);
            boot(name, host);
        }
        
        script.id = uuid;
        script.addEventListener('load', handleLoad, true);
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
        for (let [key, val] of properties) host[key] = val;
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
        const { contentWindow, contentDocument, src, attributes: attrs, innerHTML } = partial;
        const { href, origin, pathname, searchParams } = new URL(src);
        const { name, attributes: props } = contentDocument.querySelector('meta[type="partial"]') || document.createElement('meta');
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
        
        processDormant.call(url, ...partials);
        javascripts.forEach( setup.bind({ name, host }) );
        host.append(...styles);
        host.append(...javascripts);
        host.setAttribute('data-src', reformed);
        partial.replaceWith(host);
        setTimeout(x => start(document), 450);
        if (more.length) setTimeout(x => process.call(this, ...more), 450);
    }
    
    function onLoad(e) {
        if (e.target.readyState !== 'complete') return;
        const { location } = window;
        const partials = document.querySelectorAll('iframe[partial]');
        
        if (partials.length) process.call(location, ...partials);
    }
    
    if (document.readyState !== 'complete') document.addEventListener('readystatechange', onLoad, true);
    else onLoad({ type: 'manual', target: document });
    
    
    return {
        start,
        process,
    };
})(document);

export { frameless };
