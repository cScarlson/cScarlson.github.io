
import { DOMIO, Namespace, ChildNodes, Slot, BindingExchangeSlot, BindingExchangeEach } from './decorators.js';
import { Mutations } from './mutation/mutation.js';

class Core {
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
    
    constructor() {
        
    }
    
    register(id, ...modules) {
        const { registry } = this;
        registry.set(id, modules);
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
        
        if (children.length) this.mount(...children);
        if (has) this.decorate(element, ...[ ...CORE_DECORATORS, ...decorators ]);
        if (has) observers.set( element, new Mutations({ core: this, element }) );
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
    
    // export precepts
    this.register = register;
    this.bootstrap = bootstrap;
    
    return this;
};

var V = new (function Vertex(Core, Facade) {
    var v = Facade.call(function v(id, ...decorators) {
        if (this instanceof V) return new Vertex(Core, Facade);  // if invoked with `new`, create new instance.
        return v.register(id, ...decorators);
    }, new Core());
    
    return v;
})(Core, Facade);

export { V as default, V, Core, Facade };
