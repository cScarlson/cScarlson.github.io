
import utils, {} from '../utilities.js';

const { log } = console;

class Observer {
    state = null;
    observers = new Set();
    
    constructor(options = {}) {
        const { state } = { ...this, ...options };
        
        this.state = state;
        
        return this;
    }
    
    attach(observer, notify = true) {
        const { observers } = this;
        observers.add(observer);
        return this;
    }
    
    detach(observer) {
        const { observers } = this;
        observers.delete(observer);
        return this;
    }
    
    notify(state = this.state) {
        const { observers } = this;
        observers.forEach( observer => observer.update(state) );
        return this;
    }
    
}

const BindingExchangeEach = function BindingExchangeEach(element) {
    const { $ } = this;
    
    function handleRequest(e) {
        const { detail, target } = e;
        const { type, key } = detail;
        const { [key]: fallback } = element;
        const data = utils.get(key)($) || fallback;
        const observer = new Observer({ state: data });
        const nesting = !!target.querySelector('each');
        
        if (!data) return;
        observer.attach(target, false);
        target.fire('binding:response:each', observer);
        // if (!nesting) 
        observer.notify();
        e.stopPropagation();
        e.stopImmediatePropagation();
    }
    
    this.on('binding:request:each', handleRequest, true);
    
    return this;
};

export { BindingExchangeEach };
