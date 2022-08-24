
import V, {} from '../core.js';

V('module', 'include', function Module(element) {
    const { attributes, init: $init } = element;
    var { type, src } = attributes;
    var { value: type } = type;
    
    function handleLoad(e) {
        const { firstElementChild: script } = element;
        const { innerHTML } = script;
        const clone = document.createElement('script');
        
        script.replaceWith(clone);
        clone.innerHTML = innerHTML;
    }
    
    function init() {
        $init.call(this);
    }
    
    this.init = init;
    this.on('load', handleLoad, true);
    
    return this;
});
