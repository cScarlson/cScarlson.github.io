
import V, {} from './vertices/core.js';
import { Store } from './vertices/store/store.js';
import './vertices/slot/slot.js';
import './vertices/each/each.js';
import './vertices/include/include.js';
import './vertices/module/module.js';

const content = [];
const { log } = console;
const delay = (delay) => new Promise( r => setTimeout(r, delay) );
const fake = () => delay(3_000).then( x => content );

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

V('app', 'sandbox', function App($) {
    const thus = this;
    const later = $.querySelector('#later');
    
    function init() {
        this.on('click', this);
        this.subscribe('child:later:ready', this);
        // this.attach(handleState);
        this.attach(this);
        return this;
    }
    
    function handleContent(content) {
        // log(`@handleContent`, content);
    }
    
    function handleEvent(e) {
        const { type, data } = e;
        log(`@app.handleEvent`, type, data);
    }
    
    function handleState(state) {
        log(`@app.call`, state);
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

V('child:now', Sandbox, function ChildNow($) {
    
    this.innerHTML = '...child:now';
    // $.log(`@child:now`, this, $);
    
    return this;
});

V('child:later', Sandbox, function ChildLater($) {
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

V('sandbox', Sandbox);
V.bootstrap(document.body.parentElement);
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
