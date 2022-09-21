
import { DOMIO, Namespace, ChildNodes, Slot, BindingExchangeSlot, BindingExchangeEach } from './decorators.js';
import { Mutations } from './mutation/mutation.js';

const { log } = console;

class Core {
    medium = new EventTarget();
    registry = new Map();
    instances = new Map();
    observers = new Map();
    decorators = [
        DOMIO,
        Namespace,
        ChildNodes,
        Slot,
        BindingExchangeSlot,
        BindingExchangeEach,
    ];
    
    constructor() {}
    
    register(id, ...modules) {
        const { registry } = this;
        registry.set(id, modules);  // id should be an element tagName.
        return this;
    }
    
    unregister(id) {
        const { registry } = this;
        registry.delete(id);
        return this;
    }
    
    bootstrap(element, ...more) {
        this.mount(element, ...more);
    }
    
    mount(element, ...more) {
        if (!element) return this;
        const { registry, instances, observers, decorators: CORE_DECORATORS } = this;
        const { tagName, children } = element;
        const id = tagName.toLowerCase();
        const has = registry.has(id);
        const decorators = registry.get(id);
        const observer = new Mutations({ core: this, element });
        
        if (has) this.decorate(element, ...[ ...CORE_DECORATORS, ...decorators ]);
        if (has) observers.set(element, observer);
        if (children.length) this.mount(...children);
        if (has) observer.connect();
        if (element.init) element.init();
        
        if (more.length) return this.mount(...more);
        return this;
    }
    
    decorate(element, Decorator, ...more) {
        var { registry } = this;
        var Decorator = typeof Decorator === 'string' ? registry.get(Decorator) : Decorator;
        var instance = Decorator.constructor === Array ? this.decorate(element, ...Decorator) : Decorator.call(element, element);
        
        if (more.length) return this.decorate(instance, ...more);
        return instance;
    }
    
    start(type, element) {
        if ( !this.registry.has(type) ) return this;
        const { registry, decorators: CORE_DECORATORS } = this;
        const decorators = [ ...CORE_DECORATORS, ...registry.get(type) ];
        const instance = this.decorate(element, ...decorators);
        
        return this;
    }
    
    publish(channel, data) {
        const { medium } = this;
        const e = new MessageEvent(channel, { data });
        
        medium.dispatchEvent(e);
        
        return this;
    }
    
    subscribe(channel, handler) {
        const { medium } = this;
        medium.addEventListener(channel, handler, true);
        return this;
    }
    
    unsubscribe(channel, handler) {
        const { medium } = this;
        medium.removeEventListener(channel, handler, true);
        return this;
    }
    
};

const Facade = function Facade(core) {
    const thus = this;
    
    function register(id, ...decorators) {
        core.register(id, ...decorators);
        return this;
    }
    
    function bootstrap(element, ...more) {
        core.bootstrap(element, ...more);
        return this;
    }
    
    function start(type, element) {
        core.start(type, element);
        return this;
    }
    
    function publish(channel, data) {
        core.publish(channel, data);
        return this;
    }
    
    function subscribe(channel, handler) {
        core.subscribe(channel, handler);
        return this;
    }
    
    function unsubscribe(channel, handler) {
        core.unsubscribe(channel, handler);
        return this;
    }
    
    // export precepts
    this.register = register;
    this.bootstrap = bootstrap;
    this.start = start;
    this.publish = publish;
    this.subscribe = subscribe;
    this.unsubscribe = unsubscribe;
    
    return this;
};

const V = new (function Vertex(Core, Facade) {
    var v = Facade.call(function v(id, ...decorators) {
        if (this instanceof V) return new Vertex(Core, Facade);  // if invoked with `new`, create new instance.
        return v.register(id, ...decorators);
    }, new Core());
    
    return v;
})(Core, Facade);

export { V as default, V, Core, Facade };
