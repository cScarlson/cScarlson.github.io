
const { log } = console;
const { top } = window;
const { document, location, EventTarget, MessageEvent } = top;
const { baseURI } = document;
const { pathname } = new URL(location);
const medium = new EventTarget();

class Subject {
    static observers = new Set();
    static state = { initial: true };
    
    constructor(state = {}) {
        Subject.state = state;
    }
    
    static attach(observer, notify = true) {
        const { state } = this;
        
        this.observers.add(observer);
        if (notify) observer.call(state, state);
        
        return this;
    }
    
    static detach(observer) {
        this.observers.delete(observer);
        return this;
    }
    
    static notify(state = this.state) {
        this.state = state;
        for (const observer of this.observers) observer.call(state, state);
        return this;
    }
    
}

class Route extends Subject {
    static medium = new EventTarget();
    id = '[error]';
    path = '[error]';
    rmd = '[error]';
    parent = this;
    $children = new Map();
    get children() { return [ ...this.$children.values() ] }
    
    constructor(options = {}) {
        super({ id: pathname });
        const { id, path, rmd, parent, children = [] } = { ...this, ...options };
        
        this.id = id;
        this.path = path;
        this.rmd = rmd;
        this.parent = parent;
        this.link(...children);
        medium.addEventListener('router:race', this, true);
        if ( this.isMatch() ) Route.notify(this);
        
        return this;
    }
    
    link(child, ...more) {
        if (!child) return child;
        const { $children } = this;
        const route = new Route({ ...child, parent: this });
        
        $children.set(route.id, route);
        
        if (more.length) return this.link(...more);
        return child;
    }
    
    isMatch() {  // basic. modify to include path === * and parent traversal paths.
        const { id } = this;
        const { pathname: base } = new URL(baseURI);
        const { pathname } = new URL(location);
        const path = `${base}${id}`.replace('//', '/');
        const is = (pathname === path) || (pathname === `${path}/`);
        
        return is;
    }
    
    #handleRace = setTimeout.bind(window, (e, is = this.isMatch()) => {
        if (!is) return;
        e.stopImmediatePropagation();
        Route.notify(this);
    }, 0);
    
    handleEvent(e) {
        if (e.type === 'router:race') return this.#handleRace(e);
    }
    
}

top.addEventListener('popstate', function handlePopstate(e) {
    const { state, timeStamp } = e;
    const data = { state, timeStamp };
    const event = new MessageEvent('router:race', { data });
    
    medium.dispatchEvent(event);
}, true);

export { Route };
export const root = new Route({
    id: '/',
    path: '',
    rmd: './app/children/home/home.rmd.html',
    children: [
        { id: '/articles', path: 'articles', rmd: './app/children/article/collection.rmd.html' },
        { id: '/article', path: 'article', rmd: './app/children/article/article.rmd.html' },
        { id: '/publishers', path: 'publishers', rmd: './app/children/publisher/collection.rmd.html' },
        { id: '/join', path: 'join', rmd: './app/children/join/join.rmd.html' },
        { id: '/about', path: 'about', rmd: './app/children/about/about.rmd.html' },
        { id: '/404', path: '404', rmd: './app/children/404/404.rmd.html' },
    ],
});
