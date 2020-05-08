
import { IEventAggregator } from '@motorman/core';
import { Subject } from '@motorman/core/utilities/patterns/behavioral';

interface IRoute {
    url: string;
    name?: string;
    data?: any;
    children?: IRoute[];
}

class RouteComposite implements IRoute {
    static $routes: Map<string, RouteComposite> = new Map();
    private static target: EventTarget = new EventTarget();
    public active: boolean = false;
    public expression: string = '';
    public pattern: RegExp = new RegExp('');
    public wildcard: boolean = false;
    public length: number = 0;
    public id: string = '';  // '/root/parent-b/some-other-child/:id', '/root/parent-a/some-child/:id' 
    public url: string = '';  // '/some-other-child/:id', '/some-child/:id'
    public name: string = '';
    public data: any = { };
    public parent: RouteComposite = this;
    public $children: Map<string, RouteComposite> = new Map();
    public get children(): RouteComposite[] { return Array.from( this.$children.values() ); }
    public set children(value: RouteComposite[]) { this.$children.clear(); value.forEach( (r) => this.$children.set(r.url, r) ); }
    
    constructor(options: IRoute, parent?: RouteComposite) {
        var { url = '', name = '', data = {}, children = [] } = options;
        var parent = parent || this;
        var url = { '': true }[ url ] ? '/' : url
          , url = { '*': true }[ url ] ? '/*' : url
          ;
        var id = `${parent.id}/${url}`.replace(/\/{2,}/g, '/')  // ensure no more than 1 "/" as delimiter
          , expression = id.replace(/(:[^/]+)/g, '([^/]+)')  // eg: '/items/:id' --> '/items/([^/]+)'
          , expression = (url !== '/*') ? expression : expression.replace('/*', '/(.*)')  // let all wildcard-routes match, upstream to root
          , pattern = new RegExp(`^${expression}$`)  // eg: /^/items/([^/]+)$/ Note: '/items/*' --> /^/items/*$/ (note "*")
          , wildcard = /^[^*]*\/\*{1}$/.test(id)
          , length = (id.split('/')).length
          ;
        
        this.expression = expression;
        this.pattern = pattern;
        this.wildcard = wildcard;
        this.length = length;
        this.id = id;
        this.url = url;
        this.name = name;
        this.data = data;
        this.parent = parent;
        this.children = <RouteComposite[]>children.map( (options: IRoute) => <IRoute>new RouteComposite(options, this) );
        
        if ( parent.$children.has(url) ) console.warn(`Warning! Child Route "${url}" already exists in parent "${parent.id}"`);
        if ( RouteComposite.$routes.has(id) ) console.warn(`Warning! Route "${id}" already exists in global routes`);
        RouteComposite.$routes.set(id, this);  // register route by unique identifier
        window.addEventListener('hashchange', this.handleHashChange, false);
        
        return this;
    }
    
    static publish(channel: string, data: any, ...more: any[]) {
        // console.log('>>>>>>', channel, data);
        // if ( !this.pattern.test(data.newURL) ) return this;
        // var route: RouteComposite = this;
        // var params = { };
        
        // get params...
        // while ( !this.pattern.test(channel) && route.parent !== route && !{ '*': true }[ route.url ] ) route = route.parent;
        // if ( !this.pattern.test(channel) && route !== this && route.url !== '*' ) return this;
        // console.log('>>>>>>', channel, this === route, this.pattern.test(channel), route);
        // this.active = (new RegExp('')).test(channel);  // ?...
        // this.target.dispatchEvent( new CustomEvent(channel, { detail: { route, data, params } }) );
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
        var data = { old: oldURI, url: newURI, route: this, event: e };
        
        if ( !this.pattern.test(newURI) ) return this;
        e.stopImmediatePropagation();  // prevent multiple dispatch. take fist match.
        
        RouteComposite.publish(type, data);
        RouteComposite.publish(newURI, data);
        
        return this;
    };
    
}

class StateMachine {}

class Router extends Subject {
    private static INSTANCE: any = null;  // provide as Singleton for now
    public static $instances: Map<string, Router> = new Map();
    public routes: RouteComposite[] = [ ];
    public route: RouteComposite = null;
    
    constructor(public name: string, public schema: IRoute[]) {
        super('route');
        var routes = schema.map( (r: IRoute) => <IRoute>new RouteComposite(r) );
        var current = document.location
        var { href, hash } = current;
        
        this.routes = <RouteComposite[]>routes;
        if (!hash) document.location.hash = '/';
        RouteComposite.subscribe('hashchange', this.handleRouteChange);
        window.dispatchEvent( new HashChangeEvent('hashchange', { newURL: location.href, oldURL: href }) );
        // console.log('ALL-->', RouteComposite.$routes);
        // console.log('\n\n');
        
        if (!Router.INSTANCE) Router.INSTANCE = this;  // provide as Singleton for now
        return Router.INSTANCE;
    }
    
    static set(router: Router) {
        this.$instances.set(router.name, router);
        return this;
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
    
    public handleRouteChange = (e: CustomEvent) => {
        // if (this.route) console.log('ROUTE CHANGE', this.route.id, !!this.route, this.route.wildcard, this.route.pattern.test(e.detail.url));
        // else console.log('ROUTE CHANGE', e.detail.route.id, !!e.detail.route, e.detail.route.wildcard, e.detail.route.pattern.test(e.detail.url));
        // if ( this.route && this.route.pattern.test(e.detail.url) ) return this;  // wildcard-routes always match current route. if current route matches, anyway, nothing needs to happen.
        // if ( this.route && !this.route.wildcard && this.route.pattern.test(e.detail.url) ) return this;  // wildcard-routes always match current route. if current route matches, anyway, nothing needs to happen.
        // if ( this.route && this.route.wildcard && e.detail.route.wildcard && !Router.isDecendent(this.route.id, e.detail.route.id) ) return this;
        var { type, detail } = e;
        var { old, url, route, event } = detail;
        var parent = route.parent;
        
        // while ( parent !== parent.parent && !parent.pattern.test(url) ) console.log('???', (parent = parent.parent).id);
        // while ( parent !== parent.parent && !parent.wildcard && !parent.pattern.test(url) ) parent = parent.parent;
        // if (parent.wildcard) console.log('--P', parent.id);
        this.route = route;
        this.notify();
        // console.log('FINAL', route.id);
        // console.log('YAY!', type, url, route);
    };
    
    public handle404 = (e: CustomEvent) => {
        
    };
    
    // public handleHashChange = (e: HashChangeEvent) => {
        
    // };
    
}

export { IRoute, Router, RouteComposite };
