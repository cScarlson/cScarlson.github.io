
import V, {} from '../core.js';

const { log, warn } = console;

/**
 * @patterns : { Exponential Backoff }
 */
V('vertex', 'partial', function Vertex(element) {
    const { attributes, init: $init } = element;
    var { type } = attributes;
    var { value: type } = type;
    var TIMEOUT = 1;
    var LIMIT = 1024;
    
    function handleLoad(e) {
        const { firstElementChild: script } = element;
        const { innerHTML } = script;
        const clone = document.createElement('script');
        
        script.replaceWith(clone);
        clone.type = 'module';
        clone.innerHTML = innerHTML;
        
        e.stopPropagation();
        e.stopImmediatePropagation();
        element.fire('clone:ready', element);
    }
    
    function handleCloneReady(e) {
        if (!TIMEOUT) return;
        if (TIMEOUT > LIMIT) return warn(`Warning! Exponential Backoff limit for vertex "${type}" was reached.`);  // throw warning? error?
        V.start(type, element);
        setTimeout( handleTimeout, (TIMEOUT *= 2) );
    }
    
    function handleModuleReady(e) {
        if (e.target !== element) return;
        TIMEOUT = 0;
    }
    
    function handleTimeout() {
        element.fire('clone:ready', element);
    }
    
    function init() {
        $init.call(this);
    }
    
    this.init = init;
    this.on('load', handleLoad, true);
    this.on('clone:ready', handleCloneReady, true);
    this.on('vertex:ready', handleModuleReady, true);
    
    return this;
});
