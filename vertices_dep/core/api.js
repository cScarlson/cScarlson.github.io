
import { Core } from './core';


var Facade = function Facade(core) {
    var thus = this;
    
    function configure() {
        return core.configure.apply(core, arguments);
    }
    
    function register(metadata) {
        core.register(metadata);
        return this;
    }
    
    function bootstrap(options) {
        core.init(options);
        return this;
    }
    
    // export precepts
    this.utils = core.utils;
    this.config = configure;
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
