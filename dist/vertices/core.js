
import { LIFECYCLE_EVENTS } from './events.js';
import { bootstrap } from './bootstrap.js';
import { Metadata } from './metadata.js';
import { ModuleComposite as Composite } from './module-composite.js';
import { Queue } from './patterns/ds/queue.js';

/*
---- template
|****************************************************************|
| KEY                           VALUE                            |
|****************************************************************|
|                                                                |
|                                                                |
|________________________________________________________________|

---- components
|****************************************************************|
| TYPE                          COMPONENT                        |
|****************************************************************|
| app                           object                           |
| menu                          class                            |
|________________________________________________________________|

---- modules
|****************************************************************|
| NODE                          TYPE                             |
|****************************************************************|
| module[type="app"]            app                              |
| module[type="menu"]           menu                             |
|________________________________________________________________|
*/

const { log, warn, error } = console;
const { onverticesbootstrapinvoked, onloaded, onmount, oninit } = LIFECYCLE_EVENTS;
const queue = new Queue();
const DEFAULTS = {};

class ModuleComposite extends Composite {
    static network = new EventTarget();
    exp = /^\[(.+)\]$/i;
    
    constructor(options, p) {
        super(options, p);
        const { parent, module } = this;
        const { attributes } = module;
        
        // log(`@.........`, module, module.attributes, attributes)
        if (module !== document) this.bind(...attributes);
        
        return this;
    }
    
    bind(attribute, ...more) {
        if (!attribute) return attribute;
        const { parent, exp } = this;
        const { name, value } = attribute;
        const attachable = this.test(attribute);
        const [ x, key ] = name.match(exp) || [];
        
        if (attachable) this.publish('attribute:attachable', { child: this, parent, attribute, key, value });
        if (more.length) return this.bind(...more);
        return attribute;
    }
    
    test(attribute) {
        const { exp } = this;
        const { name } = attribute;
        const result = exp.test(name);
        
        return result;
    }
    
    publish(channel, data) {
        const e = new CustomEvent(channel, { detail: data });
        ModuleComposite.network.dispatchEvent(e);
        return this;
    }
    
    subscribe(channel, handler) {
        ModuleComposite.network.addEventListener(channel, handler, true);
        return this;
    }
    
    unsubscribe(channel, handler) {
        ModuleComposite.network.removeEventListener(channel, handler, true);
        return this;
    }
    
}

class Core extends Map {
    static composite = new ModuleComposite({ type: 'ROOT', module: document });
    static network = new EventTarget();
    observers = new Set();
    network = new EventTarget();
    store = new EventTarget();
    types = new Map();
    instances = new Map();
    databindings = new Map();
    get state() { return Object.fromEntries(this) }
    
    constructor(options) {
        super();
        const {  } = { ...this, ...options };
        log(`@compose...`, Core.composite);
        Core.composite.subscribe('attribute:attachable', e => this.publish(e.type, { ...e.detail, core: this }));
    }
    
    static compose(data) {
        if (data.parent === document) return data.modules.reduce(link, this.composite);
        const { composite: root } = this;
        const { parent, modules } = data;
        const type = parent.getAttribute('type') || 'typeless';  // could be document from first call or a static module (partial).
        var composite = root.find(parent) || new ModuleComposite({ type, module: parent }, root)
          , composite = modules.reduce(link, composite)
          ;
        
        function link(composite, module) {
            const type = module.getAttribute('type') || 'typeless';
            const child = new ModuleComposite({ type, module }, composite);
            
            composite.set(module, child);
            
            return composite;
        }
        
        return composite;
    }
    
    register(type, component) {
        if ( this.types.has(type) ) return this;
        this.types.set(type, component);
        return this;
    }
    
    bootstrap(details) {
        if ( !details.module.hasAttribute('type') ) return this;  // used as partial/include. don't bootstrap.
        const { types, instances } = this;
        const { type, module, self, attributes } = details;
        const component = types.get(type);
        const isFunction = (component instanceof Function);
        const isArrowFunction = (isFunction && !component.prototype);
        const detail = { self, module, metadata: details };
        const e = new CustomEvent(onmount, { detail });
        const instance = isFunction ? isArrowFunction ? component(detail) : new component(detail) : component;
        const result = Metadata.call(details, { instance });
        
        log(`... ... ... BOOTSTRAP`, type);
        self.dispatchEvent(e);
        if (onmount in instance) instance[onmount](detail);
        instances.set(module, instance);
        
        return result;
    }
    
    bind(module) {
        if ( !this.databindings.has(module) ) return module;
        const { databindings, instances } = this;
        const { parent, assignments } = databindings.get(module);
        const child = instances.get(module);
        const attributes = [ ...assignments.values() ].reduce(reduce, { });
        const e = new CustomEvent(oninit);
        
        function reduce(state, { key, value, attribute }) {
            const observer = `watch:${key}`;
            const result = parent[value];
            const data = { key, value: result, attribute };
            var state = { ...state, [key]: data };
            
            if (observer in child) child[observer](result);
            log(`... ... ... BIND`, key, state);
            
            return state;
        }
        databindings.delete(module);  // delete asap as module nesting & <slot>s may trigger additional (unnecessary) binding.
        module.dispatchEvent(e);
        if (oninit in child) child[oninit]({ attributes });
    }
    
    bindX(module) {
        if ( !this.databindings.has(module) ) return module;
        const { databindings, instances } = this;
        const { parent, key, value } = databindings.get(module);
        const child = instances.get(module);
        const e = new CustomEvent(oninit);
        
        log(`... ... ... BIND`, key);
        child[key] = parent[value];
        databindings.delete(module);  // delete asap as module nesting & <slot>s may trigger additional (unnecessary) binding.
        module.dispatchEvent(e);
        if (oninit in child) child[oninit]({ });
    }
    
    set(key, value) {  // todo: use reducer
        super.set(key, value);
        this.notify(key);  // notify on subscribers on this medium
        return this;
    }
    
    attach(observer=() => {}, notify=true) {
        const { observers, state } = this;
        
        observers.add(observer);
        if (notify) observer.call(state, 'vertices:observer:init');
        
        return this;
    }
    
    detach(observer) {
        const { observers } = this;
        observers.delete(observer);
        return this;
    }
    
    notify(key='key:undefined') {
        const { observers, state } = this;
        for (let observer of observers) observer.call(state, key);
        return this;
    }
    
    publish(channel, data) {  // global to Vertices
        const e = new CustomEvent(channel, { detail: data });
        Core.network.dispatchEvent(e);
        return this;
    }
    
    subscribe(channel, handler) {  // global to Vertices
        Core.network.addEventListener(channel, handler, true);
        return this;
    }
    
    unsubscribe(channel, handler) {  // global to Vertices
        Core.network.removeEventListener(channel, handler, true);
        return this;
    }
    
    fire(channel, data) {  // local to Vertex
        const e = new CustomEvent(channel, { detail: data });
        this.network.dispatchEvent(e);
        return this;
    }
    
    on(channel, handler) {  // local to Vertex
        this.network.addEventListener(channel, handler, true);
        return this;
    }
    
    off(channel, handler) {  // local to Vertex
        this.network.removeEventListener(channel, handler, true);
        return this;
    }
    
}

const Facade = function Facade(core) {
    const thus = this;
    
    function getFnType(f) {
        const fn = `${f}`;  // stringify
        const re = /^[function]*\s*\w*\(.+,\s*(.+)\)\s*[\=\>]*\s*\{/i;  // stop caring after the first "{" of function-body.
        const [ x, arg="type='unknown'" ] = fn.match(re) || [];
        const [ y, value ] = arg.split('=');
        const type = value.replace(/\s*[`'"]/g, '');
        
        return type;
    }
    
    function register(component) {
        const { ['v:type']: type=getFnType(component) } = component;
        core.register(type, component);
        return this;
    }
    
    // export precepts
    this.has = core.has.bind(core);
    this.get = core.get.bind(core);
    this.set = core.set.bind(core);
    this.attach = core.attach.bind(core);
    this.detach = core.detach.bind(core);
    this.fire = core.fire.bind(core);
    this.on = core.on.bind(core);
    this.off = core.off.bind(core);
    this.publish = core.publish.bind(core);
    this.subscribe = core.subscribe.bind(core);
    this.unsubscribe = core.unsubscribe.bind(core);
    this.bootstrap = core.bootstrap.bind(core);
    this.bind = core.bind.bind(core);
    this.register = register;
    
    return this;
};

const V = new (function Vertices(core, Facade) {
    var v = Facade.call(v, core);
    
    function v(component) {
        if (this instanceof V) return new Vertices(new Core(component), Facade);  // component is an options object.
        V.register(component);
        return V;
    }
    
    return v;
})(new Core(DEFAULTS), Facade);

function handleVerticesBootstrapInvoked(e) {
    const { type: event, detail: data } = e;
    Core.compose(data);
}

function handleVertexLoaded(e) {
    const { type: event, detail: details } = e;
    const { v, type, module, selector } = details;
    const delayed = new Promise( r => setTimeout(r, 250) )  // #delayhack: wait more than 0, which is falsey.
    
    module.removeEventListener('load', handleVertexLoaded, true);
    delayed
        .then( x => v.bootstrap(details) )
        .then( x => v.bind(module) )
        .then( x => bootstrap(v, selector, module) )
        ;
}

function handleAttributeAttachable(e) {
    const { detail: data } = e;
    const { core, child, parent, attribute, key, value } = data;
    const { instances, databindings } = core;
    const { module } = child;
    const { module: source } = parent;
    const instance = instances.get(source);
    const has = databindings.has(module);
    const deference = { module, parent: instance, assignments: new Map() };
    
    if (!has) databindings.set(module, deference);
    databindings.get(module).assignments.set(key, { key, value, attribute });
    log(`... ... ... EVENT`, module.getAttribute('type'), key);
}

V
 .subscribe(onverticesbootstrapinvoked, handleVerticesBootstrapInvoked)
 .subscribe(onloaded, handleVertexLoaded)
 .subscribe('attribute:attachable', handleAttributeAttachable)
 ;

export default V;
export { V };
export {
    LIFECYCLE_EVENTS,
    bootstrap,
};
