
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
    function component(id, Component) {
        core.define.apply(core, arguments);
        return this;
    }
    function directive(id, Directive) {
        core.registerComponent.apply(core, arguments);
        return this;
    }
    
    function register(id, Component) {
        var method = { '$component': 'component', '$service': 'service', '$directive': 'directive' }[ id ]
          , method = method || { 'function': 'service', 'string': 'component' }[ typeof id ]
          ;
        this[method].apply(this, arguments);
        
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
    this.component = component;
    this.directive = directive;
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
