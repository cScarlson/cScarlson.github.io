
import { LIFECYCLE_EVENTS } from './events.js';
import { Metadata } from './metadata.js';
/* ================================================================================================================================
THIS FILE NEED MORE ATTENTION.
    * There are object (im)mutability problems with map-returns.
    * There are ugly hacks to circumvent Race Conditions.
PROBLEM IS.
    * Google Chrome (and others?) perform setting an element's innerHTML asynchronously.
    * See "addEventListener" (map) for more information.
================================================================================================================================ */

const { log, warn, error } = console;
const { onestablished, onloaded } = LIFECYCLE_EVENTS;
const ERROR_MODULE_UNDEFINED = new Error(`Load encountered undefined instead of module`);
const cache = new Map();

function load(options) {
    const { modules } = options;
    const responses = modules
        .map( m => initialize( new Metadata({ ...options, module: m }) ) )
        .map(get)
        ;
    const promises = Promise.all(responses);
    const result = promises.then(iterate);
    
    return result;
}

function initialize(details) {
    const { module } = details;
    const { childNodes, attributes } = module;
    const children = [ ...childNodes ];
    const type = module.getAttribute('type');
    const src = module.getAttribute('src');
    
    return Metadata.call(details, { children, type, src, attributes });
}

function refetch(src) {
    const has = cache.has(src);
    
    if (has) return cache.get(src);
    return cache  // set and get/return request/response promise
        .set( src, fetch(src).then( response => response.text() ) )
        .get(src)
        ;
}

function get(details) {  // fetches module [lazily] based on module's src.
    const { src } = details;
    
    return refetch(src)
        .then( contents => Metadata.call(details, { contents }) )
        ;
}

function iterate(solutions) {
    const resolutions = solutions
        .map(inject)
        .map(duplicate)
        .map(establish)
        .map(query)
        .map(reduce)
        .map(project)
        .map(addEventListener)
        .map(activate)  // notifications are unnecessary before this point.
        ;
    const promises = Promise.all(resolutions).catch(katch);
    
    return promises;
}

function addEventListener(details) {
    const { type, module } = details;
    const { lastElementChild: style } = module;
    const { tagName } = style;
    const isConventional = !!{ 'STYLE': true, 'LINK': true }[ tagName ];
    const CONVENTION_WARNING = [
        `Vertex Convention Warning: module of type "${type}" is unconventional in that it does not define an HTMLStyleElement.`,
        `Vertices uses its onload event to continue bootstrapping the module.`
    ].join('\n');
        
    const handleVertexLoaded = (function handleVertexStyleLoaded(e) {
        const { v } = this;  // ATTENTION! details bound as this.
        const { target } = e;
        const { parentElement: module } = target;
        
        e.stopImmediatePropagation();  // ensure only one listener hears this as modules can be nested (capture/bubble continues).
        module.removeEventListener('load', handleVertexLoaded, true);
        v.publish(onloaded, details);
    }).bind(details);  // ATTENTION! bind details as this
    
    if (!isConventional) warn(CONVENTION_WARNING);
    module.addEventListener('load', handleVertexLoaded, true);
    
    return details;
}

function inject(details) {  // creates initial DOM Nodes.
    const { module, contents } = details;
    module.innerHTML = contents;  // CAUTION! setting innerHTML in Chrome is asynchronous op.
    return details;
}

function duplicate(details) {
    const { module } = details;
    const script = module.querySelector('script');
    const self = document.createElement('script');
    
    return Metadata.call(details, { script, self });
}

function establish(details) {
    const { v } = details;
    v.publish(onestablished, details);
    return details;
}

function query(details) {  // gets all <slot>s from within initial DOM scope.
    const { module } = details;
    const slots = [ ...module.querySelectorAll('slot') ];
    return Metadata.call(details, { slots });
}

function reduce(details) {  // busywork for organizing module's <slot>s.
    var { slots } = details;
    var slots = slots.reduce( ($, slot) => $.set(slot.name || '', slot), new Map() );
    return Metadata.call(details, { slots });
}

function project(details) {
    var { slots, children } = details;
    var slots = append(slots, ...children);
    return Metadata.call(details, { slots });
}

function append(slots, node, ...more) {  // fulfill slots
    if (!slots.size) return slots;
    if (!node) return slots;
    const { slot: key = '' } = node;
    const slot = slots.get(key);
    const has = slots.has(key);
    
    if (has) slot.appendChild(node);
    if (more.length) return append(slots, ...more);
    return slots;
}

function activate(details) {
    const { script, self } = details;
    
    self.type = script.type;
    script.replaceWith(self);
    self.innerHTML = script.innerHTML;
    
    return details;
}

function katch(error) {
    warn(`@LOAD-KATCH`, error);
}

export { load };
