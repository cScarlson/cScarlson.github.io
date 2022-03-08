
import { load } from './load.js';

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
const DEFAULTS = {};

class Core extends Map {
    static network = new EventTarget();
    network = new EventTarget();
    modules = new Map();
    types = new Map();
    
    constructor(options) {
        super();
        const {  } = { ...this, ...options };
    }
    
    register(type, component) {
        if ( this.has(type) ) return this;
        log(`Core.register`, type);
        this.set(type, component);
        return this;
    }
    
    collect(details) {
        const { modules } = this;
        const { type, module } = details;
        const { lastElementChild: style } = module;
        const { tagName } = style;
        const isConventional = !!{ 'STYLE': true }[ tagName ];
        const CONVENTION_WARNING = [
            `Vertex Convention Warning: module of type "${type}" is unconventional in that it does not define an HTMLStyleElement.`,
            `Vertices uses its onload event to continue bootstrapping the module.`
        ].join('\n');
        
        const handleVertexLoaded = (function handleVertexLoadedStyle(details, e) {
            const { v, selector } = details;  // ATTENTION! details bound as this.
            const { type: event, target, path } = e;
            const { parentElement: module } = target;
            const type = module.getAttribute('type');
            
            e.stopImmediatePropagation();  // ensure only one listener hears this as modules can be nested (capture/bubble continues).
            module.removeEventListener('load', handleVertexLoaded, true);
            this.bootstrap(details);
            bootstrap(v, selector, module);  // continue bootstrapping down into module tree having now been loaded.
        }).bind(this, details);  // ATTENTION! bind details as this
        
        if (!isConventional) warn(CONVENTION_WARNING);
        modules.set(module, details);
        module.addEventListener('load', handleVertexLoaded, true);
        
        return this;
    }
    
    mount() {
        const { modules } = this;
        for (let [module, details] of modules) this.bootstrap(details);
    }
    
    bootstrap(details) {
        log(`Core.bootstrap`, details.type);
        const { modules } = this;
        const { v, selector, type, module, clone: script } = details;
        const component = this.get(type);
        
        /**
         * intention: instantiate components based on function, class, object-literal.
         *  * assume function & class are indistinguishable from one another.
         *  * use try/catch to overcome lack of DuckTyping at our disposal.
         */
        try {  // try functions and objects
            component.call(script, module, details);  // assume (function() {}).call or ({ }).call exists. fn.arguments[0] is module.
        } catch(error0) {  // catch classes
            // warn(`@Core.bootstrap() #try-catch: was unable to call component for type "${type}".`, error0);
            try {
                const instance = new component(script);  // (class {}).call exists but throws error. instantiate object and check for ({ }).call.
                if (instance.call) instance.call(module, details);  // fn.arguments[0] is also module.
            } catch(error1) {
                // error(`@Core.bootstrap() #try-catch-2: Component type "${type}" may have caused the warning above. See error below.`);
                // throw error1;
            }
        }
        
        modules.delete(module);
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
    
    function register(component) {
        const { ['v:type']: type } = component;
        core.register(type, component)//.mount({ });
        return this;
    }
    
    // export precepts
    this.has = core.has.bind(core);
    this.get = core.get.bind(core);
    this.fire = core.fire.bind(core);
    this.on = core.on.bind(core);
    this.off = core.off.bind(core);
    this.publish = core.publish.bind(core);
    this.subscribe = core.subscribe.bind(core);
    this.unsubscribe = core.unsubscribe.bind(core);
    this.collect = core.collect.bind(core);
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

function bootstrap(vertex, selector='module', root=document) {
    var modules = root.querySelectorAll(selector)
      , modules = [ ...modules ]
      ;
    const details = load({ vertex, selector }, modules);
    
    return details;  // promise
}

export default V;
export { V };
export {
    bootstrap,
};
