
import { LIFECYCLE_EVENTS } from './events.js';
import { Metadata } from './metadata.js';
import { VirtualNode } from './virtualnode.js';
import { VertexProxyHandler, Context } from './proxy.js';
import utilities from './utilities/utilities.js';
/* ================================================================================================================================
THIS FILE NEED MORE ATTENTION.
    * There are ugly hacks to circumvent Race Conditions.
PROBLEM IS.
    * Google Chrome (and others?) perform setting an element's innerHTML asynchronously.
    * See "addEventListener" (map) for more information.
================================================================================================================================ */


const { log, warn, error } = console;
const { onverticesbootstrapinvoked, onmount } = LIFECYCLE_EVENTS;
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
    const { v, module } = details;
    const { docket } = v;
    const { childNodes, attributes } = module;
    const children = [ ...childNodes ];
    const type = module.getAttribute('type');
    const src = docket.has(type) ? docket.get(type) : module.getAttribute('src');
    const model = { };
    
    return Metadata.call(details, { children, type, src, attributes, model });
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
    const { v, src } = details;
    const gotten = refetch(src)
        .then( contents => Metadata.call(details, { contents }) )
        ;
    gotten.then( details => v.publish('module:contents:retrieved', details) );
    return gotten;
}

function iterate(solutions) {
    const resolutions = solutions
        .map(inject)
        .map(select)
        .map(virtualize)
        .map(clone)
        .map(addEventListener)
        .map(activate)  // notifications are unnecessary before this point.
        ;
    const promises = Promise.all(resolutions).catch(katch);
    
    return promises;
}

function inject(details) {  // creates initial DOM Nodes.
    const { module, contents } = details;
    module.innerHTML = contents;  // CAUTION! setting innerHTML in Chrome is asynchronous op.
    return details;
}

function select(details) {
    const { module } = details;
    const script = module.querySelector('script');
    const view = module.querySelector('[--view]');
    
    return Metadata.call(details, { script, view });
}

function virtualize(details) {
    const { module, view } = details;
    const controller = new VirtualNode({ details, node: view });
    return Metadata.call(details, { controller });
}

function clone(details) {
    const { script } = details;
    const self = document.createElement('script');
    return Metadata.call(details, { script, self });
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
        const { v, selector, view } = this;
        const { target } = e;
        const { parentElement: module } = target;
        
        utilities.delay(20)
            .then( x => create(this) )
            .then(utilities.delay)
            .then( x => slot(this) )
            .then(utilities.delay)
            .then( x => bootstrap(v, selector, view) )
            ;
        e.stopImmediatePropagation();  // ensure only one listener hears this as modules can be nested (capture/bubble continues).
        module.removeEventListener('load', handleVertexLoaded, true);
    }).bind(details);  // ATTENTION! bind details as this
    
    if (!isConventional) warn(CONVENTION_WARNING);
    module.addEventListener('load', handleVertexLoaded, true);
    
    return details;
}

function slot(details) {
    return project(reduce(query(details)));
}

function query(details) {  // gets all <slot>s from within initial DOM scope.
    const { view } = details;
    const slots = [ ...view.querySelectorAll('slot') ];
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
    
function create(details) {  // refactor this.create into load.js?
    if ( !details.module.hasAttribute('type') ) return this;  // used as partial/include. don't create.
    const { v, type, module, attributes, self, view, controller } = details;
    const { types, models } = v;
    const component = types.get(type);
    const detail = { self, module, metadata: details };
    const e = new CustomEvent(onmount, { detail });
    const handler = new VertexProxyHandler(details);
    const context = new Proxy(new Context(), handler);
    const model = component.call(context, detail);
    const result = Metadata.call(details, { model, handler });
    
    controller.initialize({ model });
    if (onmount in model) model[onmount](detail);
    models.set(module, model);
    handler.init();  // keeps handler from triggering onchange during setup (module implementation).
    self.dispatchEvent(e);
    
    return result;
}

function bootstrap(v, selector='module', parent=document) {
    var modules = parent.querySelectorAll(selector)  // ISSUE: this will also select elements that are nested somewhere within the same type of element as the selector!
      , modules = [ ...modules ]
      ;
    const details = load({ v, selector, parent, modules });
    
    v.publish(onverticesbootstrapinvoked, { parent, modules });
    
    return details;  // promise
}

function katch(error) {
    warn(`@LOAD-KATCH`, error);
}

export { bootstrap, slot };
