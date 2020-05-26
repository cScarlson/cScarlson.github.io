
import { IEventAggregator } from '@motorman/core';
import { Subject } from '@motorman/core/utilities/patterns/behavioral';

interface IRoute {
    url: string;
    name?: string;
    content?: string;
    redirect?: string;
    spoof?: string;
    data?: any;
    children?: IRoute[];
}

interface IActiveRouteDetails {
    old: string;
    url: string;
    route: RouteComposite;
    params: any;
}

class RouteComposite implements IRoute {
    static $routes: Map<string, RouteComposite> = new Map();
    private static target: EventTarget = new EventTarget();
    private target: EventTarget = new EventTarget();
    public active: boolean = false;
    public expression: string = '';
    public pattern: RegExp = new RegExp('');
    public wildcard: boolean = false;
    public length: number = 0;
    public root: boolean = false;
    public id: string = '';  // '/root/parent-b/some-other-child/:id', '/root/parent-a/some-child/:id' 
    public url: string = '';  // '/some-other-child/:id', '/some-child/:id'
    public name: string = '';
    public content: string = '';
    public data: any = { };
    public redirect: string = '';
    public spoof: string = '';
    public parent: RouteComposite = this;
    public previousSibling: RouteComposite = null;
    public nextSibling: RouteComposite = null;
    public $children: Map<string, RouteComposite> = new Map();
    public get children(): RouteComposite[] { return Array.from( this.$children.values() ); }
    public set children(value: RouteComposite[]) { this.$children.clear(); value.forEach( (r) => this.$children.set(r.url, r) ); }
    
    constructor(options: IRoute, parent?: RouteComposite) {
        var { url = '', name = '', content = '', redirect = '', spoof = '', data = {}, children = [] } = options;
        var parent = parent || this;
        var url = { '': true }[ url ] ? '/' : url
          , url = { '*': true }[ url ] ? '/*' : url
          ;
        var id = `${parent.id}/${url}`.replace(/\/{2,}/g, '/')  // ensure no more than 1 "/" as delimiter
          , expression = id.replace(/(:[^/]+)/g, '([^/]+)')  // eg: '/items/:id' --> '/items/([^/]+)'
          , expression = (url !== '/*') ? expression : expression.replace('/*', '/(.*)')  // let all wildcard-routes match, upstream to root
          , expression = expression.replace(/^(.*)\?(.*)$/, '$1[?]$2')  // for routes with query-parameters
          , expression = `${expression}([?].*)*`  // for routes without query-parameters
          , expression = `^${expression}$`
          , expression = expression.replace(/^\^([^?]*)\[([?])\](.*)\(\[\?\]\.\*\)\*\$$/, '$1$2([?]$3.*)|(.+[&]$3.*)')  // replace redundancy i/a
          , pattern = new RegExp(expression)  // eg: /^/items/([^/]+)$/ Note: '/items/*' --> /^/items/*$/ (note "*")
          , wildcard = /^[^*]*\/\*{1}$/.test(id)
          , length = id.split('/').length
          , root = (id === url)
          ;
        
        this.expression = expression;
        this.pattern = pattern;
        this.wildcard = wildcard;
        this.length = length;
        this.root = root;
        this.id = id;
        this.url = url;
        this.name = name;
        this.content = content;
        this.redirect = redirect;
        this.spoof = spoof;
        this.data = data;
        this.parent = parent;
        this.link(...children);
        
        if ( parent.$children.has(url) ) console.warn(`Warning! Child Route "${url}" already exists in parent "${parent.id}"`);
        if ( RouteComposite.$routes.has(id) && parent !== this ) console.warn(`Warning! Route "${id}" already exists in global routes`);
        RouteComposite.$routes.set(id, this);  // register route by unique identifier
        window.addEventListener('v:hashchange', this.handleHashChange, false);  // subscribe for each instance
        
        return this;
    }
    
    static publish(channel: string, data: any, ...more: any[]) {
        var detail = data;
        var e = new CustomEvent(channel, { detail });
        this.target.dispatchEvent(e);
        
        return this;
    }
    
    static subscribe(channel: string, handler: Function) {
        this.target.addEventListener(channel, <EventListenerOrEventListenerObject>handler, false);
        return this;
    }
    
    static unsubscribe(channel: string, handler: Function) {
        this.target.removeEventListener(channel, <EventListenerOrEventListenerObject>handler, false);
        return this;
    }
    
    trigger(action: string, ...params: any[]): RouteComposite {
        this[action](...params);
        this.children.forEach( (r: RouteComposite) => r[action](...params) );
        return this;
    }
    
    link(first?: IRoute, next?: IRoute, ...more: IRoute[]) {
        if (!first) return null;
        var previous = new RouteComposite(first, this);
        var route = next ? new RouteComposite(next, this) : null;
        
        previous.nextSibling = route;  // set first.next, even if null.
        this.$children.set(previous.url, previous);  // set first to maintain ordinality.
        if (route) this.$children.set(route.url, route);  // set next to maintain ordinality.
        if (route) route.previousSibling = previous;  // previous must exist at this point.
        if (route && more) route.nextSibling = this.link(...more);  // set next before setting next.next.previous.
        if (route && route.nextSibling) route.nextSibling.previousSibling = route;  // set next.next.previous.
        
        return previous;  // ensure first is not skipped.
    }
    
    /**
     * @intention Handle RouteChange and cancel propagation to ensure only first-match gets handled.
     *  * Note: Ordinality of route-declarations in schema requires that Wildcard-Routes be declared
     *  *       at higher indices (below) than more specific routes. The same should be regarded for
     *  *       Parameterized-Routes (/items/:id). For instance, declaring /items/0 above /items/:id
     *  *       will provide the first-match of route /items/0 while matching /items/{1,2,3, ...} to
     *  *       /items/:id; likewise, declaring /items/:id before /items/0 will prevent matches on
     *  *       /items/0 from ever getting processed.
     */
    public handleHashChange = (e: HashChangeEvent) => {
        var { type, oldURL, newURL } = e;
        var olds = oldURL.split('#'), news = newURL.split('#');
        var oldURI = `${olds[1]}`, newURI = `${news[1]}`;
        var matching = this.pattern.test(newURI);
        var data = { old: oldURI, url: newURI, route: this, event: e };
        
        RouteComposite.publish('*', data);  // provide clients with opportunity to stopImmediatePropagation
        if ( !matching ) return this;
        e.stopImmediatePropagation();  // prevent multiple dispatch. take fist match.
        
        RouteComposite.publish(newURI, data);
        RouteComposite.publish('match', data);
        
        return this;
    };
    
}

class StateMachine implements History {  // https://developer.mozilla.org/en-US/docs/Web/API/History
    private history: History = window.history;
    get length(): number { return this.history.length; }
    get scrollRestoration(): ScrollRestoration { return this.history.scrollRestoration; }
    set scrollRestoration(value: ScrollRestoration) { this.history.scrollRestoration = value; }
    get state(): any { return this.history.state; }
    
    constructor() {}
    
    back(): StateMachine {
        var result = this.history.back();
        return this;
    }
    forward(): StateMachine {
        var result = this.history.forward();
        return this;
    }
    go(delta: number = 0): StateMachine {  // where 0 is current index in stack, 0 is location.reload(), -1 is this.back(), 1 is this.forward()
        var result = this.history.go(delta);
        return this;
    }
    pushState(state: any, title = '', url?: string): StateMachine {
        var result = this.history.pushState(state, title, url);
        return this;
    }
    replaceState(state: any, title = '', url?: string): StateMachine {
        var result = this.history.replaceState(state, title, url);
        return this;
    }
    
}

class Router extends Subject {
    private static INSTANCE: any = null;  // provide as Singleton for now
    public static $instances: Map<string, Router> = new Map();
    public static history: StateMachine = new StateMachine();
    private target: EventTarget = new EventTarget();
    public history: StateMachine = new StateMachine();
    public routes: RouteComposite[] = [ ];
    public active: IActiveRouteDetails = null;
    public get route(): RouteComposite { return this.active ? this.active.route: null; }
    
    constructor(public name: string, public schema: IRoute[]) {
        super('active');
        var routes = schema.map( (r: IRoute) => <IRoute>new RouteComposite(r) );
        var current = document.location
        var { href, hash } = current;
        
        this.routes = <RouteComposite[]>routes;
        if (!hash) document.location.hash = '/';  // set before subscribing
        // if (!hash) history.replaceState();//'/';  // set before subscribing
        RouteComposite.subscribe('match', this.handleMatch);
        window.addEventListener('hashchange', this.handleHashChange, false);  // subscribe before RouteComposites register handlers [which may call e.stopImmediatePropagation()]
        window.dispatchEvent( new HashChangeEvent('hashchange', { newURL: location.href, oldURL: href }) );  // trigger after subscribing
        
        if (!Router.INSTANCE) Router.INSTANCE = this;  // provide as Singleton for now
        return Router.INSTANCE;
    }
    
    static set(router: Router) {
        this.$instances.set(router.name, router);
        return this;
    }
    
    static guard(guard: (route: RouteComposite) => boolean) {
        // set [root] RouteGuard (static? Router only has 1? Or should each instance have only 1? Or should router run it through Reducer middleware? Use The Chain of Responsibility Pattern?)
    }
    
    static matches(control: string, subject: string): boolean {
        if (subject === control) return true;
        if ({ '': true }[ control ]) console.warn(`Route matches for "${control}" returns a False-Positive`);
        var re = control.replace(/(:[^/]+)/ig, '(.+)'), pattern = new RegExp(re);
        var matches = pattern.test(subject);
        
        return matches;
    }
    
    static isDecendent(control: string, subject: string): boolean {
        var expression = new RegExp(`^${control}.+$`), is = expression.test(subject);
        return is;
    }
    
    static getQueryParams(uri: string) {
        var parameters = { }, url = new URL(uri), params = new URLSearchParams(url.search), keys = params.keys();
        for (let key of keys) parameters[key] = params.get(key);
        return parameters;
    }

    static getPathParams(schema: string, uri: string) {
        var exp = schema.replace(/(:[^/]+)/ig, '([^?]+)'), re = new RegExp(exp);
        var matchesK = schema.match(re) || [ ], matchesV = uri.match(re) || [ ];
        var parameters = { };
        
        for (let i = 0, len = matchesK.length; i < len; i++) parameters[ matchesK[i].replace(/^:([^:]+)$/, '$1') ] = matchesV[i];
        delete parameters[schema];
        
        return parameters;
    }

    static getURLParams(schema: string, uri: string) {
        var url = `http://www.fake.com${uri}`;
        var parameters = { ...this.getQueryParams(url), ...this.getPathParams(schema, uri) };
        return parameters;
    }
    
    static navigate(options: { url: string, params?: any }) {
        var { url, params = {} } = options;
        console.warn('Router.static.navigate not implemented. Use History API?');
        return this;
    }
    
    guard(guard: (route: RouteComposite) => boolean) {
        // set [root] RouteGuard (static? Router only has 1? Or should each instance have only 1? Or should router run it through Reducer middleware? Use The Chain of Responsibility Pattern?)
        // this.guards.push(guard);  // Chain of Responsibility?
        // Route.guards.push(guard);
    }
    middleware(guards: Function[]) {
        // guards.forEach( (guard) => this.guard() );
    }
    
    navigate(url: string, data?: {}, ...more: any[]) {
        var options = { ...data, url };
        
        Router.navigate(options);
        this.publish(`navigate:${url}`, data, ...more);
        
        return this;
    }
    
    publish(channel: string, data?: {}, ...more: any[]) {
        var detail = data;
        var e = new CustomEvent(channel, { detail });
        
        this.target.dispatchEvent(e);
        this.target.dispatchEvent( new CustomEvent('*', { detail: e }) );
        
        return this;
    }
    
    subscribe(channel: string, handler: Function) {
        this.target.addEventListener(channel, <EventListenerOrEventListenerObject>handler, false);
        return this;
    }
    
    unsubscribe(channel: string, handler: Function) {
        this.target.removeEventListener(channel, <EventListenerOrEventListenerObject>handler, false);
        return this;
    }
    
    notify(state?: RouteComposite) {
        // var { id, url, name, data, wildcard, parent } = state;
        // if (!state) state = new RouteComposite({ url: '404', name: 'router-404', content: 'Page Not Found' });
        super.notify(state);
        // this.publish('update', state);
        
        return this;
    }
    
    public handleHashChange = (e: HashChangeEvent) => {
        var { type, oldURL, newURL } = e;
        var hashchange = new HashChangeEvent('v:hashchange', { oldURL, newURL });
        
        window.dispatchEvent(hashchange);
        this.publish(type, e);
    };
    
    public handleMatch = (e: CustomEvent) => {
        var { type, detail } = e;
        var { old, url, route, event } = detail;
        var { redirect, spoof } = route;
        var params = Router.getURLParams(route.id, url);
        var detail = { ...detail, params };
        var state = { route: route.id, parent: route.parent.id, oldURL: old, newURL: url };
        
        if (redirect) location.hash = `${redirect}`;
        if (spoof) return this.handleMatch( new CustomEvent(type, { detail: { ...detail, route: RouteComposite.$routes.get(spoof) } }) );
        this.active = detail;
        // this.history.replaceState(state, '', route.id);
        this.notify();
        this.publish(type, detail);
    };
    
}

export { IRoute, IActiveRouteDetails, Router, RouteComposite };
