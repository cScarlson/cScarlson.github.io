
const { log, warn, error } = console;
const ERROR_MODULE_UNDEFINED = new Error(`Load encountered undefined instead of module`);

class LIFECYCLE_EVENTS {
    static onmount = 'vertex:active';
}

function load(options, modules) {
    const { vertex: v, selector } = options;
    const responses = modules
        .map( m => initialize({ module: m, selector, v }) )
        .map(get)
        ;
    const promises = Promise.all(responses);
    const result = promises.then(iterate);
    
    return result;
}

function initialize(details) {
    const { module } = details;
    const { childNodes } = module;
    const children = [ ...childNodes ];
    const type = module.getAttribute('type');
    const src = module.getAttribute('src');
    
    return { ...details, children, type, src };
}

function get(details) {  // fetches module [lazily] based on module's src.
    const { src } = details;
    const pResponse = fetch(src, { cache: 'force-cache' })
        , pContents = pResponse.then( response => response.text() )
        , pResult = pContents.then( contents => ({ ...details, contents }) )
        ;
    return pResult;
}

function iterate(solutions) {
    const resolutions = solutions
        .map(inject)
        .map(duplicate)
        .map(collect)
        .map(query)
        .map(reduce)
        .map(project)
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

function duplicate(details) {
    const { module } = details;
    const script = module.querySelector('script');
    const clone = document.createElement('script');
    
    return { ...details, script, clone };
}

function collect(details) {
    const { v } = details;
    v.collect(details);
    return details;
}

function query(details) {  // gets all <slot>s from within initial DOM scope.
    const { module } = details;
    const slots = [ ...module.querySelectorAll('slot') ];
    return { ...details, slots };
}

function reduce(details) {  // busywork for organizing module's <slot>s.
    var { slots } = details;
    var slots = slots.reduce( ($, slot) => $.set(slot.name || '', slot), new Map() );
    return { ...details, slots };
}

function project(details) {
    var { slots, children } = details;
    var slots = append(slots, ...children);
    return { ...details, slots };
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
    const { module, script, clone } = details;
    
    clone.type = script.type;
    script.replaceWith(clone);
    clone.innerHTML = script.innerHTML;
    
    return { ...details };
}

function katch(error) {
    warn(`@LOAD-KATCH`, error);
}

export { load };
