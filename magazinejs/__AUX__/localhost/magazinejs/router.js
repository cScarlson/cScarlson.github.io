
const { log, warn } = console;

class Subject {
    #observers = new Set();
    state = {};
    
    constructor(state = {}) {
        this.state = state;
    }
    
    attach(observer, notify = true) {
        this.#observers.add(observer);
        if (notify) observer.call(this.state, this.state);
        return this;
    }
    
    detach(observer) {
        this.#observers.delete(observer);
        return this;
    }
    
    notify(state = this.state) {
        for (const observer of this.#observers) observer.call(state, state);
        return this;
    }
    
}

class RouterEvent extends MessageEvent {
    url = '[UNSET]';
    
    constructor(type, options = {}) {
        super(type, options);
        const { url } = { ...this, ...options };
        this.url = url;
    }
    
};

export class Route extends Subject {
    static medium = new EventTarget();
    type = 'pathname';  // href, origin, port, host, hostname, pathname, pathname:segment, filename, search:name, search:value, hash
    uri = '[UNSET]';
    parent = this;
    $children = new Map();
    get children() { return [ ...this.$children.values() ] }
    get id() {
        const { type, parent, uri } = this;
        
        if (parent === this) return uri;
        if (type === 'href') return uri;
        if (type === 'origin') return uri;
        if (type === 'port') return `${parent.uri}:${uri}`;
        if (type === 'host') return uri;
        if (type === 'hostname') return uri;
        if (type === 'pathname') return `${parent.uri}/${uri}`;
        if (type === 'filename') return `${parent.uri}/${uri}`;
        if (type === 'search:name') return `${parent.uri}?${uri}`;
        if (type === 'search:value') return `${parent.uri}?${uri}`;
        if (type === 'hash') return `${parent.uri}#${uri}`;
        return '$';
    }
    
    constructor(options = {}) {
        super();
        const { type, uri, parent = this, children = [] } = { ...this, ...options };
        const id = (parent === this) ? uri : `${uri}`;
        
        this.type = type;
        this.uri = uri;
        this.parent = parent;
        this.link(...children);
        Route.medium.addEventListener('router:match:race', this, true);
        Route.medium.addEventListener('router:match', this, true);
        
        return this;
    }
    
    link(child, ...more) {
        if (!child) return child;
        const { $children } = this;
        const route = new Route({ ...child, parent: this });
        
        $children.set(route.id, route);
        
        if (more.length) return this.link(...more);
        return route;
    }
    
    match(url) {
        const location = new URL(url);
        const event = new RouterEvent('router:match:race', { url: location });
        Route.medium.dispatchEvent(event);
    }
    
    ['is:match'](url) {
        const { id, type, uri, parent, [`is:${type}`]: handle } = this;
        const is = handle.call(this, url);
        
        if (!is) return false;
        if (this === parent) return is;
        // log(`CHECKING...`, type, uri);
        return parent['is:match'](url);
    }
    
    ['is:undefined'](url) {
        throw new Error(`Route Match Error: unknown type "${this.type}" for ${url}`);
    }
    
    ['is:href'](url) {
        const { uri, parent } = this;
        const { href, origin, port, host, hostname, pathname, searchParams, hash } = url;
        
        if (uri === '*') return true;
        if (uri === href) return true;
        return false;
    }
    
    ['is:origin'](url) {
        const { uri, parent } = this;
        const { href, origin, port, host, hostname, pathname, searchParams, hash } = url;
        
        if (uri === '*') return true;
        if (uri === origin) return true;
        return false;
    }
    
    ['is:port'](url) {
        const { uri, parent } = this;
        const { href, origin, port, host, hostname, pathname, searchParams, hash } = url;
        
        if (uri === '*') return true;
        if (uri === port) return true;
        return false;
    }
    
    ['is:host'](url) {
        const { uri, parent } = this;
        const { href, origin, port, host, hostname, pathname, searchParams, hash } = url;
        
        if (uri === '*') return true;
        if (uri === host) return true;
        return false;
    }
    
    ['is:hostname'](url) {
        const { uri, parent } = this;
        const { href, origin, port, host, hostname, pathname, searchParams, hash } = url;
        
        if (uri === '*') return true;
        if (uri === hostname) return true;
        return false;
    }
    
    ['is:pathname'](url) {
        const { uri, parent } = this;
        const { href, origin, port, host, hostname, pathname, searchParams, hash } = url;
        const { length, [length - 1]: head, ...rest } = pathname.split('/');
        const more = Array.apply(null, { ...rest, length: length-1 });
        const modified = more.join('/');
        const next = new URL(`${origin}${modified}`);
        
        log(`@PATH!!!NAME`, uri === pathname, `"${uri}"`, `"${pathname}"`, head, modified, next, more);
        if (uri === '*') return true;
        if (uri === pathname) return true;
        return false;
    }
    
    ['is:pathname:segment'](url) {
        const { uri, parent } = this;
        const { href, origin, port, host, hostname, pathname, searchParams, hash } = url;
        const { length, [length - 1]: head, ...rest } = pathname.split('/');
        const more = Array.apply(null, { ...rest, length: length-1 });
        const modified = more.join('/');
        const next = new URL(`${origin}${modified}`);
        
        log(`@PATHNAME!!!SEGMENT`, uri === pathname, `"${uri}"`, `"${pathname}"`, head, modified, next, more);
        if (uri === '*') return true;
        if (uri === pathname) return true;
        if (uri === head) return true;
        // if (pathname !== '/') log( href, `${next}`, modified, more );
        // if (pathname !== '/') return this['is:pathname'](url);
        return false;
    }
    
    ['is:filename'](url) {
        const { uri, parent } = this;
        const { href, origin, port, host, hostname, pathname, searchParams, hash } = url;
        const { length, [length - 1]: filename, ...rest } = pathname.split('/');
        const more = Array.apply(null, { ...rest, length: length-1 });
        const modified = more.join('/');
        const next = new URL(`${origin}${modified}`);
        
        log(`@FILENAME`, uri === filename, `"${uri}"`, `"${filename}"`, pathname, more, `"${next}"`);
        if (uri === '*') return true;
        if (uri === filename) return true;
        return false;
    }
    
    ['is:search:name'](url) {
        const { uri, parent } = this;
        const { href, origin, port, host, hostname, pathname, searchParams, hash } = url;
        const has = url.has(uri);
        
        if (uri === '*') return true;
        if (has) return true;
        return false;
    }
    
    ['is:search:value'](url) {
        const { uri, parent } = this;
        const { href, origin, port, host, hostname, pathname, searchParams, hash } = url;
        const [ name, value ] = uri.split('=');
        const param = searchParams.get(name);
        
        if (uri === '*') return true;
        if (param === value) return true;
        return false;
    }
    
    ['is:hash'](url) {
        const { uri, parent } = this;
        const { href, origin, port, host, hostname, pathname, searchParams, hash } = url;
        
        if (uri === '*') return true;
        if (uri === hash) return true;
        return false;
    }
    
    #handleRouteMatchRace(e) {
        const { type, uri } = this;
        const { type: t, url, data } = e;
        const { href, origin, port, host, hostname, pathname, searchParams, hash } = url;
        const is = this['is:match'](url);
        
        if (!is) return;
        // log(`@----->`, this.id, this.parent);
        e.stopImmediatePropagation();
        log(`@handleRouteMatchRace`, is, type, uri);
    }
    
    #handleRouteMatch(e) {
        const { url, data } = e;
        // log(`@handleRouteMatch`, url, data, e);
    }
    
    handleEvent(e) {
        if (e.type === 'router:match:race') return this.#handleRouteMatchRace(e);
        if (e.type === 'router:match') return this.#handleRouteMatch(e);
        warn(`@Router: unhandled event`, e);
    }
    
};
