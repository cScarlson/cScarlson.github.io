
import { Core } from './core';


var Facade = function Facade(core) {
    var thus = this;
    
    function configure() {
        return core.configure.apply(core, arguments);
    }
    function service(Service) {
        core.registerService.apply(core, arguments);
        return this;
    }
    function element(definition) {
        core.define(definition);
        return this;
    }
    function component(id, Directive) {
        core.registerComponent.apply(core, arguments);
        return this;
    }
    
    function register(item, Class) {
        var type = { 'string': 'component', 'function': 'service', 'object': item.decorator }[ typeof item ];
        this[type].call(this, item, Class);
        return this;
    }
    
    function bootstrap(options) {
        core.init(options);
        return this;
    }
    
    // export precepts
    this.utils = core.utils;
    this.config = configure;
    this.service = service;
    this.element = element;
    this.component = component;
    this.register = register;
    this.bootstrap = bootstrap;
    
    return this;
};

/**
 * API
 */
var Vertex = new (function Vertices(Core, Facade) {
    
    var V = Facade.call( function V() {
        if (this instanceof V) return ( new Vertices(Core, Facade) );
        return V.register.apply(V, arguments);
    }, new Core() );
    
    return V;
})(Core, Facade);

export { Vertex };
