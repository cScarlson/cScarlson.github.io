
import { Slot, BindingExchangeSlot } from '/vertices/slot/decorators.js';
import { BindingExchangeEach } from '/vertices/each/decorators.js';

// CORE DECORATORS
const DOMIO = function DOMIO(element) {
    const thus = this;
    
    function on(type, handler, options = false) {
        this.addEventListener(type, handler, options);
        return this;
    }
    
    function off(type, handler, options = false) {
        this.removeEventListener(type, handler, options);
        return this;
    }
    
    function fire(type, detail, options = {}) {
        var options = { bubbles: true, ...options };
        var e = new CustomEvent(type, { detail, ...options });
        this.dispatchEvent(e);
        return this;
    }
    
    // export precepts
    this.on = on;
    this.off = off;
    this.fire = fire;
    
    return this;
};

const Namespace = function Namespace(element) {
    const { dataset } = this;
    this.$ = { };
    return this;
};

const ChildNodes = function ChildNodes(element) {
    const { $, childNodes } = this;
    
    this.$ = { ...$, childNodes: [ ...childNodes ] };
    
    return this;
};

export { DOMIO, Namespace, ChildNodes };
export { Slot, BindingExchangeSlot, BindingExchangeEach };
