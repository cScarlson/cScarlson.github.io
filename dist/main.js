// Import stylesheets
// import './style.css';
// import { content } from './content';

const content = [];
const { log } = console;
const delay = (delay) => new Promise( r => setTimeout(r, delay) );
const fake = () => delay(3_000).then( x => content );

var utils = new (class Utilities {
    
    interpolate(str) {
      return (o) => (new Function(`with (this) return \`${str}\`;`) ).call(o);
    }

})();

class Mutations {
    core = null;
    observer = null;
    element = null;
    config = { childList: true, subtree: true };
    
    constructor({ core, element }) {
        const { config } = this;
        const observer = new MutationObserver(this.observe);
        
        this.core = core;
        this.observer = observer;
        this.element = element;
        element.addEventListener('destroy', this.handleDestroy, false);
        observer.observe(element, config);
    }
    
    observe = (mutations, observer) => {
        for (let record of mutations) this['handle:any'](record);
    };
    
    ['handle:any'](mutation) {
        const { type } = mutation;
        const action = `handle:${type}`;
        if (action in this) this[action](mutation);
    }
    
    ['handle:childList'](mutation) {
        this['handle:childList:addedNodes'](mutation);
        this['handle:childList:removedNodes'](mutation);
    }
    
    ['handle:childList:addedNodes'](mutation) {
        var { core } = this;
        var { addedNodes } = mutation;
        var addedNodes = [ ...addedNodes ];
        var elements = addedNodes.filter( n => n.nodeType === Node.ELEMENT_NODE );
        
        // log(`@addedNodes`, elements.length, elements);
        core.bootstrap(...elements);
    }
    
    ['handle:childList:removedNodes'](mutation) {
        const { removedNodes } = mutation;
        const elements = [ ...removedNodes ].filter( n => n.nodeType === Node.ELEMENT_NODE );
        elements.forEach(this.destroyNode);
    }
    
    destroyNode = (node) => {
        const e = new MessageEvent('destroy', { data: node });
        node.dispatchEvent(e);
    };
    
    destroy() {
        const { observer } = this;
        observer.disconnect();
        // log(`destroyed`);
    }
    
    handleDestroy = (e) => {
        if (this.element !== e.data) return;
        const { element, core } = this;
        const { observers } = core;
        
        e.stopPropagation();
        e.stopImmediatePropagation();
        element.removeEventListener('destroy', this.handleDestroy, false);
        observers.delete(element);
        this.destroy();
    };
    
}

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

const Slot = function Slot(element) {
    const { $ } = this;
    const { childNodes = [] } = $;
    const projections = childNodes.reduce( reduce, new Map() );
    
    function reduce($, node) {
        const { slot = '' } = node;
        const has = $.has(slot);
        
        if (!has) $.set(slot, [ ]);
        $.get(slot).push(node);
        // log(`@Slot.reduce`, element.tagName, `"${slot}"`, $);
        
        return $;
    }
    
    if (!projections.size) return this;
    this.$ = { ...$, projections };
    
    return this;
};

const BindingExchangeSlot = function BindingExchangeSlot(element) {
    const { $, tagName } = this;
    
    function handleRequest(e) {
        const { detail, target } = e;
        const { projections: fallback } = element;
        const { projections: data = fallback } = $;
        
        if (!data) return;
        if ({ 'SLOT': true, 'EACH': true }[ tagName ]) return;  // <slot>s & <each>s are assumed to have children naturally.
        target.fire('binding:response:slot', data);
        e.stopPropagation();
        e.stopImmediatePropagation();
    }
    
    this.on('binding:request:slot', handleRequest, false);
    
    return this;
};

const BindingExchangeEach = function BindingExchangeEach(element) {
    const { $ } = this;
    
    function handleRequest(e) {
        const { detail, target } = e;
        const { type, key } = detail;
        const { [key]: fallback } = element;
        const { [key]: data = fallback } = $;
        
        if (!data) return;
        target.fire('binding:response:each', data);
        e.stopPropagation();
        e.stopImmediatePropagation();
    }
    
    this.on('binding:request:each', handleRequest, true);
    
    return this;
};

const core = new class Core {
    registry = new Map();
    instances = new Map();
    observers = new Map();
    decorators = [
        DOMIO,
        Namespace,
        ChildNodes,
        Slot,
        BindingExchangeSlot,
        BindingExchangeEach,
    ];
    
    constructor() {
        
    }
    
    register(id, ...modules) {
        const { registry } = this;
        registry.set(id, modules);
        return this;
    }
    
    bootstrap(element, ...more) {
        this.mount(element, ...more);
    }
    
    mount(element, ...more) {
        if (!element) return this;
        const { registry, instances, observers, decorators: CORE_DECORATORS } = this;
        const { tagName, children } = element;
        const id = tagName.toLowerCase();
        const has = registry.has(id);
        const decorators = registry.get(id);
        
        if (children.length) this.mount(...children);
        if (has) this.decorate(element, ...[ ...CORE_DECORATORS, ...decorators ]);
        if (has) observers.set( element, new Mutations({ core: this, element }) );
        if (element.init) element.init();
        
        if (more.length) return this.mount(...more);
        return this;
    }
    
    decorate(element, Decorator, ...more) {
        var { registry } = this;
        var Decorator = typeof Decorator === 'string' ? registry.get(Decorator) : Decorator;
        var instance = Decorator.constructor === Array ? this.decorate(element, ...Decorator) : Decorator.call(element, element);
        
        if (more.length) return this.decorate(instance, ...more);
        return instance;
    }
    
};

core.register('slot', function Slot(element) {
    const { attributes, innerHTML: template, outerHTML } = this;
    const { ['name']: attr } = attributes;
    const { name, value = '' } = attr;
    const key = 'projections';
    
    function inject(node) {
        const clone = node.cloneNode(true);
        element.appendChild(clone);
    }
    
    function handleData(e) {
        if ( !e.detail.has(value) ) return;
        const { detail: data } = e;
        const projections = data.get(value);
        
        element.innerHTML = '';
        projections.forEach(inject);
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.off('binding:response:slot', handleData, true);
    }
    
    this.on('binding:response:slot', handleData, true);
    this.fire('binding:request:slot', { type: 'slot', key });
    
    return this;
});

core.register('each', function Each(element) {
    const { attributes, innerHTML: template, outerHTML } = this;
    const { ['for']: attr } = attributes;
    const { name, value } = attr;
    const [ alias, key ] = value.split(':');
    const interpolate = utils.interpolate(template);
    
    function map(item) {
        const context = { [alias]: item };
        const interpolated = interpolate(context);
        return interpolated;
    }
    
    function handleData(e) {
        if (e.target !== element) return;
        const { detail: data } = e;
        const interpolations = data.map(map);
        const innerHTML = interpolations.join('');
        
        element.innerHTML = innerHTML;
        e.stopPropagation();
        e.stopImmediatePropagation();
    }
    
    function handleRerender(e) {
        if (e.detail !== value) return;
        element.outerHTML = outerHTML;
        e.stopPropagation();
        e.stopImmediatePropagation();
    }
    
    function init() {
        this.on('each:rerender', handleRerender, true);
        this.on('binding:response:each', handleData, true);
        this.fire('binding:request:each', { type: 'each', key }, { bubbles: false });
    }
    
    this.init = init;
    
    return this;
});


core.register('include', function Include(element) {
    const { attributes } = element;
    var { type, src } = attributes;
    var { value: src } = src;
    var src = src || 'get the source from a docket';
    
    function handleContent(html) {
        element.innerHTML = html;
    }
    
    function init() {
        var content = fetch(src, { 'Content-Type': 'text/html' })
          , content = content.then( res => res.text() )
          , content = content.then(handleContent)
          ;
    }
    
    this.init = init;
    
    log(`@Include`);
    
    return this;
});
core.register('module', 'include', function Module(element) {
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

class Store {  // uses The Observer Pattern (with ".call()" instead of ".update()")
    state = { };
    observers = new Set();
    reducer = () => { };
    
    constructor(options = {}) {
        const { reducer, state, notify = false } = options;
        
        this.reducer = reducer;
        this.state = state;
        if (notify) this.notify();
        
        return this;
    }
    
    dispatch(action) {
        var { reducer, state } = this;
        var state = reducer.execute(state, action);
        
        this.state = state;
        this.notify();
        
        return this;
    }
    
    update() {
        throw new Error(`Store Observer Error: observer was undefined.`);
    }
    
    attach(observer = this, notify = true) {
        const { state, observers } = this;
        
        observers.add(observer);
        if (notify) observer.call(state, state);
        
        return this;
    }
    
    detach(observer = this) {
        const { state, observers } = this;
        observers.delete(observer);
        return this;
    }
    
    notify(state = this.state) {
        var { observers } = this;
        var observers = [ ...observers ];
        
        observers.forEach( observer => observer.call(state, state) );
        
        return this;
    }
    
}

const reducer = new class Reducer {
    middleware = new Set();
    
    constructor(middleware = new Set()) {
        this.middleware = middleware;
    }
    
    execute(state, action) {
        var { middleware } = this;
        var { type, payload } = action;
        var middleware = [ ...middleware ];
        var state = middleware.reduce( (s, fn) => fn.call(s, action), state );
        
        if (type in this) return this[type](state, payload);
        return state;
    }
    
    ['ANOTHER:TEST'](state, payload) {
        var state = { ...state, ...payload };
        return state;
    }
    
};

class Application {  // The Singleton Pattern
    static INSTANCE = null;
    target = new EventTarget();
    store = new Store({ reducer, state: { test: true } });
    
    constructor(X) {
        if (Application.INSTANCE) return Application.INSTANCE;
        Application.INSTANCE = this;
        return this;
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

const Sandbox = function Sandbox(element) {
    const thus = this;
    const core = new Application();
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

core.register('app', Sandbox, function App($) {
    const thus = this;
    const later = $.querySelector('#later');
    
    function init() {
        this.on('click', this);
        this.subscribe('child:later:ready', this);
        this.attach(this);
        return this;
    }
    
    function handleContent(content) {
        // log(`@handleContent`, content);
    }
    
    function handleEvent(e) {
        const { type, data, detail } = e;
        // log(`@app.handleEvent`, type, data, detail);
    }
    
    function handleState(state) {
        // log(`@app.call`, state);
    }
    
    this.after('...app');
    // $.log(`@app`, this, $);
    setTimeout(function tiemout() {
        later.innerHTML = `<child:later><span slot="header">Laterz</span><span slot="">Prefix</span> + Another Prefix + </child:later><p></p>`;
        fake().then(handleContent);
        setTimeout(function tiemout() {
            const { firstElementChild } = later;
            later.removeChild(firstElementChild);
        }, (1000 * 10));
    }, (1000 * 3));
    
    // export precepts
    this.init = init;
    this.handleEvent = handleEvent;
    this.call = handleState;
    
    return this.init();
});

core.register('child:now', Sandbox, function ChildNow($) {
    
    this.innerHTML = '...child:now';
    // $.log(`@child:now`, this, $);
    
    return this;
});

core.register('child:later', Sandbox, function ChildLater($) {
    const thus = this;
    const items = [
        { id: 0, name: 'a', title: "A" },
        { id: 1, name: 'b', title: "B" },
        { id: 2, name: 'c', title: "C" },
    ];
    
    this.items = items;
    this.innerHTML = [
        '<slot name="header">name="header"</slot>',
        '<ul>',
            '<each for="item:items">',
                '<li>',
                    '<slot name="">name=""</slot>',
                    '"${item.id}":"${item.name}":"${item.title}"',
                '</li>',
            '</each>',
        '</ul>'
    ].join('');
    // $.log(`@child:later`, this, $);
    $.publish('child:later:ready', { hey: 'child:later' });
    $.dispatch({ type: 'ANOTHER:TEST', payload: { test: 'yes' } });
    setTimeout(function clt() {
        const each = thus.querySelector('each[for="item:items"]');
        
        items.push({ id: 3, name: 'd', title: "D" });
        each.fire('each:rerender', 'item:items');
    }, 5000);
    
    return this;
});

core.register('sandbox', Sandbox)
    .bootstrap(document.body.parentElement)
    ;
/****
NOTES
- Modules get to decide when, where & how they acquire their templates.
- A basic ES string-template syntax is used for interpolation (create a Utilities module).
- Setting this.innerHTML is basically like calling a "render" function.
- Looping occurs through a <foreach> element (how to get the reference?).
-  - Leverage events/bubbling?
-  - Leverage core utils for (nthGrand)parentElement?
-  - Leverage middleware handlers so people can write their own looping element?
- Services are meant to sit behind a Sandbox.
- Can modules be packaged Svelte style where acquiring a template is acquiring a <template>?
-   - Can this be done with a registered <module[type][url]> module?
- Need core utils for dealing with <slots>.
- Use SDK item for input[[value="x"]]?
- Use SDK item for *[[x="x"]]?
-  - This may likely be the same system that <foreach> uses.
-  - But attribute/property binding was supposed to be performed directly through this.x = x; and this.on('change'); / Event Delegation.
- Use The Arbiter Pattern
****/
