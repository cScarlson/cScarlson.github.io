
const { log } = console;

class Application {  // The Singleton Pattern
    static INSTANCE = null;
    target = new EventTarget();
    store = null;
    
    constructor({ store }) {
        if (Application.INSTANCE) return Application.INSTANCE;
        Application.INSTANCE = this;
        
        this.store = store;
        
        return this;
    }
    
    call(element) {
        element.core = this;  // set core on element for sandbox.
        return element;
    }
    
    publish(channel, data) {
        const event = new MessageEvent(channel, { data });
        this.target.dispatchEvent(event);
        return this;
    }
    
    subscribe(channel, handler) {
        this.target.addEventListener(channel, handler, true);
        return this;
    }
    
    unsubscribe(channel, handler) {
        this.target.removeEventListener(channel, handler, true);
        return this;
    }
    
}

export { Application };
