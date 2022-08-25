
const { log } = console;

const Sandbox = function Sandbox(element) {
    const { core } = Sandbox.prototype;
    const { store } = core;
    
    function publish(...splat) {
        core.publish(...splat);
        return this;
    }
    
    function subscribe(...splat) {
        core.subscribe(...splat);
        return this;
    }
    
    function unsubscribe(...splat) {
        core.unsubscribe(...splat);
        return this;
    }
    
    function attach(...splat) {
        store.attach(...splat);
        return this;
    }
    
    function detach(...splat) {
        store.detach(...splat);
        return this;
    }
    
    function dispatch(...splat) {
        store.dispatch(...splat);
        return this;
    }
    
    // export precepts
    this.log = log.bind(console, '@');
    this.publish = publish;
    this.subscribe = subscribe;
    this.unsubscribe = unsubscribe;
    this.attach = attach;
    this.detach = detach;
    this.dispatch = dispatch;
    
    return this;
};

export { Sandbox };
