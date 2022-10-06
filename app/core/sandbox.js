
const { log } = console;
const { compile } = Handlebars;

log(`@sandbox`, compile('<h1>{{test}}</h1>')({ test: 'ze tiest' }));
const Sandbox = function Sandbox(element) {
    const { core } = element;
    const { store } = core;
    var set = set.bind(this);
    
    function set(value) {
        const template = compile(value);
        const content = template(this);
        element.innerHTML = content;
    }
    
    function use(uri) {
        const headers = { 'Content-Type': 'text/html' };
        const options = { headers };
        var promise = fetch(uri, options).then( r => r.text() )
          , promise = promise.then( template => this.template = template )
          ;
        
        return promise;
    }
    
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
    if ( !this.hasOwnProperty('template') ) Object.defineProperty(this, 'template', { set });
    this.use = use;
    this.log = log.bind(console, '@');
    this.publish = publish;
    this.subscribe = subscribe;
    this.unsubscribe = unsubscribe;
    this.attach = attach;
    this.detach = detach;
    this.dispatch = dispatch;
    
    // ops
    delete element.core;  // delete core so that modules cannot touch it directly.
    
    return this;
};

export { Sandbox };
