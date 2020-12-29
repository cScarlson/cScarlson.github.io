
import { Core, Facade } from './core';

var V = new (function Vertices(Core, Facade) {
    
    var core = new Core(Vertex), v = Facade.call( Vertex, core );  // watch for potential Race Condition on Vertex
    
    function Vertex(node, ...decorators) {
        if (this instanceof Vertex) return ( new Vertices(Core, Facade) );
        if (!node) return Vertex;
        if (node && !{ 'undefined': true }[ node.nodeType ]) return Vertex.mount(node);
        return Vertex.component.call(Vertex, node, ...decorators);
    }
    
    return v;
})(Core, Facade);

export { V };
