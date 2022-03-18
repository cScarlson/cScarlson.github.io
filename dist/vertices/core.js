
import { LIFECYCLE_EVENTS } from './events.js';
import { bootstrap, render } from './load.js';
import { Metadata } from './metadata.js';
import { ModuleComposite as Composite } from './module-composite.js';
import utilities from './utilities/utilities.js';

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
const {
    onverticesbootstrapinvoked,
    onattributeattachable,
    onchange,
    onmount,
    oninit
} = LIFECYCLE_EVENTS;
const DEFAULTS = {};

class ModuleComposite extends Composite {
    static network = new EventTarget();
    exp = /^\[(.+)\]$/i;
    
    constructor(options, p) {
        super(options, p);
        const { parent, module } = this;
        const { attributes } = module;
        
        return this;
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
    static composite = new ModuleComposite({ type: 'ROOT', module: document, instance: {} });
    static network = new EventTarget();
    observers = new Set();
    network = new EventTarget();
    store = new EventTarget();
    types = new Map();
    instances = new Map();
    databindings = new Map();
    docket = new Map();
    get state() { return Object.fromEntries(this) }
    
    constructor(options) {
        super();
        const {  } = { ...this, ...options };
        Core.composite.subscribe(onattributeattachable, e => this.publish(e.type, { ...e.detail, core: this }));
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
    
    dock(docket) {
        for (let type in docket) this.docket.set(type, docket[type]);
        return this;
    }
    
    register(type, component) {
        if ( this.types.has(type) ) return this;
        this.types.set(type, component);
        return this;
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
    
    function register(type, component) {
        core.register(type, component);
        return this;
    }
    
    // export precepts
    this.docket = core.docket;
    this.types = core.types;
    this.instances = core.instances;
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
    this.dock = core.dock.bind(core);
    this.register = register;
    
    return this;
};

const V = new (function Vertices(core, Facade) {
    var v = Facade.call(v, core);
    
    function v(option) {
        if (this instanceof V) return new Vertices(new Core(option), Facade);  // option is an options object.
        if (typeof option === 'string') return (component) => V.register(option, component);
        return V;
    }
    
    return v;
})(new Core(DEFAULTS), Facade);

function handleVerticesBootstrapInvoked(e) {
    const { type: event, detail: data } = e;
    Core.compose(data);
}

function handleVertexPropertyChange(e) {
    const { type: channel, detail: data } = e;
    const { key, details } = data;
    const { v, type, view, selector, outlet, module, instance } = details;
    
    view.notify(key, instance);
}

V
 .subscribe(onverticesbootstrapinvoked, handleVerticesBootstrapInvoked)
 .subscribe(onchange, handleVertexPropertyChange)
 ;

export default V;
export { V };
export {
    LIFECYCLE_EVENTS,
    bootstrap,
};
