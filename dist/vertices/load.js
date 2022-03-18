
import { LIFECYCLE_EVENTS } from './events.js';
import { Metadata } from './metadata.js';
import utilities from './utilities/utilities.js';
/* ================================================================================================================================
THIS FILE NEED MORE ATTENTION.
    * There are object (im)mutability problems with map-returns.
    * There are ugly hacks to circumvent Race Conditions.
PROBLEM IS.
    * Google Chrome (and others?) perform setting an element's innerHTML asynchronously.
    * See "addEventListener" (map) for more information.
================================================================================================================================ */
/* ================================================================================================================================
PROCESS PIPELINE
         _______________________________________________________________________
        |                                                                       |
        |    RECURSIVE                                                          |
        V                                                                       |
bootstrap(modules)                                                              |
        get(url)                                                                |
            inject(contents)                                                    |
                select(script, template, outlet)                                |
                    activate(script)                                            |
                        (register)                                              |
                        onload: v.bootstrap(instance)                           |
                            render(template, outlet)                            |
                                slot(outlet, children)                          |
                                    bootstrap( outlet.querySelectorAll(modules) )
================================================================================================================================ */


const { log, warn, error } = console;
const { onverticesbootstrapinvoked, onestablished, onloaded, onmount, oninit, onrender, onchange } = LIFECYCLE_EVENTS;
const ERROR_MODULE_UNDEFINED = new Error(`Load encountered undefined instead of module`);
const cache = new Map();

class VertexProxyHandler {
    initialized = false;
    details = { };
    
    constructor(details) {
        this.details = details;
    }
    
    set(target, key, value, receiver) {
        if (!this.initialized) return Reflect.set(target, key, value, receiver);
        const { details } = this;
        const { v } = details;
        const result = Reflect.set(target, key, value, receiver);
        
        v.publish(onchange, { key, details });
        
        return result;
    }
    
    init() {
        this.force(true);
        return this;
    }
    
    toggle() {
        this.force(!this.initialized);
        return this;
    }
    
    force(state) {
        this.initialized = state;
        return this;
    }
    
}

class Context {
    [onmount]() {}
    [oninit]() {}
}

class VirtualNode {
    
    constructor(options={}, parent) {
        const { node } = { ...this, ...options };
        const { nodeType } = node;
        const Model = {
            [Node.ELEMENT_NODE]: VirtualElementNode,
            [Node.TEXT_NODE]: VirtualTextNode,
            [Node.ATTRIBUTE_NODE]: VirtualAttributeNode,
        }[ nodeType ];
        
        if (!Model) return this;
        return new Model(options, parent);
    }
    
}

class AbstractVirtualNode {
    static network = new EventTarget();
    parent = null;
    template = null;
    node = null;
    nodeType = -1;
    
    constructor(options={}, parent) {
        const { node } = { ...this, ...options };
        const { nodeType } = node;
        var parent = parent || this;
        
        this.parent = parent;
        this.template = node;
        this.node = node;
        this.nodeType = nodeType;
        
        return this;
    }
    
    notify(key, instance) {
        return this;
    }
    
}

class VirtualElementNode extends AbstractVirtualNode {
    tagName = 'NONE';
    $attributes = new Map();
    $children = new Map();
    get attributes() { return Array.from( this.$attributes.values() ) }
    get children() { return Array.from( this.$children.values() ) }
    
    constructor(options={}, parent) {
        super(options, parent);
        const { node } = { ...this, ...options };
        const { tagName, attributes, childNodes } = node;
        
        this.tagName = tagName;
        this.setAttr(...attributes);
        this.setChild(...childNodes);
        
        return this;
    }
    
    setAttr(attr, ...more) {
        if (!attr) return attr;
        const { $attributes } = this;
        const { name } = attr;
        const view = new VirtualNode({ node: attr }, this);
        
        $attributes.set(name, view);
        if (more.length) return this.setAttr(...more);
        return attr;
    }
    
    setChild(node, ...more) {
        if (!node) return node;
        const { $children } = this;
        const view = new VirtualNode({ node }, this);
        
        $children.set(node, view);
        if (more.length) return this.setChild(...more);
        return node;
    }
    
    notify(key, instance) {
        const { children, attributes } = this;
        
        for (let attr of attributes) attr.notify(key, instance);
        for (let child of children) child.notify(key, instance);
        
        return this;
    }
    
}

class VirtualTextNode extends AbstractVirtualNode {
    data = '';
    
    constructor(options={}, parent) {
        super(options, parent);
        const { node } = { ...this, ...options };
        const { data } = node;
        
        this.data = data;
        
        return this;
    }
    
    notify(key, instance) {
        const { template, node, data } = this;
        const variable = `$\{${key}\}`, re = `\\$\\{${key}\\}`;
        const exp = new RegExp(re, 'gm');
        const eligible = exp.test(data);
        
        if (eligible) node.data = utilities.interpolate(variable)(instance);
        
        return this;
    }
    
}

class VirtualAttributeNode extends AbstractVirtualNode {
    owner = null;
    name = '';
    value = '';
    expression = /^\[(.+)\]$/;
    
    constructor(options={}, owner) {
        super(options);
    }
    
    notify(key, instance) {
        // if not expression.test(): return
        // else if value is key: node.parentElement[ expression.$1 ] = instance[value] (note: don't use parentElement.setAttribute! it will overwrite the instruction)
        // should Proxy use get and return <module>-value for instance?
        const { node, name, value } = this;
        return this;
    }
    
}

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
    const instance = { };
    
    return Metadata.call(details, { children, type, src, attributes, instance });
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
    const outlet = module.querySelector('[--template]');
    const template = module.querySelector('template');
    
    return Metadata.call(details, { script, outlet, template });
}

function virtualize(details) {
    const { module, template, outlet } = details;
    const view = new VirtualNode({ node: outlet });
    
    return Metadata.call(details, { view });
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
        const { v, selector, outlet } = this;  // ATTENTION! details bound as this.
        const { target } = e;
        const { parentElement: module } = target;
        
        utilities.delay(20)
            .then( x => create(this) )
            .then(utilities.delay)
            .then( x => slot(this) )
            .then(utilities.delay)
            .then( x => bootstrap(v, selector, outlet) )
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
    const { outlet } = details;
    const slots = [ ...outlet.querySelectorAll('slot') ];
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
        
function render(details) {
    const { v, outlet, module, handler, instance, selector, interpolate } = details;
    const interpolated = interpolate(instance);
    
    outlet.innerHTML = interpolated;
    handler.force(false);
    if (onrender in instance) instance[onrender]();
    handler.toggle();
    v.publish(onrender, details);
    
    return details;
}
    
function create(details) {  // refactor this.create into load.js?
    if ( !details.module.hasAttribute('type') ) return this;  // used as partial/include. don't create.
    const { v, type, module, attributes, self, outlet, template, view, instance: previous } = details;
    const { types, instances } = v;
    // const { innerHTML: tpl } = template;
    const component = types.get(type);
    const detail = { self, module, metadata: details };
    const e = new CustomEvent(onmount, { detail });
    const handler = new VertexProxyHandler(details);
    const context = new Proxy({ ...previous }, handler);
    const instance = component.call(context, detail);
    // const interpolate = utilities.interpolate(tpl);
    const result = Metadata.call(details, { instance, handler });
    
    // render(result);
    // log(`--------------------`, outlet.childNodes = view.node.childNodes);
    // for (let child of view.node.childNodes) log(child);
    // for (let child of view.node.childNodes) outlet.appendChild(child);
    if (onmount in instance) instance[onmount](detail);
    instances.set(module, instance);
    // template.remove();
    handler.init();  // keeps handler from triggering onchange during setup (module implementation).
    self.dispatchEvent(e);
    for (let key in instance) if ( !(instance[key] instanceof Function) ) view.notify(key, instance);
    
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

export { bootstrap, slot, render };
