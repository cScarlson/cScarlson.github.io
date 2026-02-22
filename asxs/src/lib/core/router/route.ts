
import type { ToDo } from '@asxs/core/types';

type Unknown = ToDo;

const { log, warn, error: err } = console;

export class Route {
    static target: EventTarget = new EventTarget();
    static observers: Set<ToDo> = new Set();
    static state: ToDo = { route: {}, data: {}, params: {}, routes: [] };
    static routes: Map<string, Route> = new Map();
    static initialized: boolean = false;
    abstracted: boolean = false;
    id: string = '';
    path: string = '';
    name: string = 'ANONYMOUS';
    data: any = {};
    target: Unknown;
    parent: Route = this;
    $children: Map<string, Route> = new Map();
    get children(): Route[] { return [ ...this.$children.values() ] }
    
    constructor(route: Partial<Route> = {}, parent: Route = this) {
        const { path, name, data, target, children } = { children: [], ...(this as ToDo), ...route };
        const id = parent ? `${parent.id}/${path}` : '#';
        const descendents = children.map(Route.compose);
        const abstracted = /^\{\w+\}$/.test(path);
        
        Route.routes.set(id, this);
        this.abstracted = abstracted;
        this.id = id;
        this.path = path;
        this.name = name;
        this.data = data;
        this.target = target;
        this.parent = parent;
        this.link(...descendents);
        Route.target.addEventListener('navigation', this, true);
        
        return this;
    }
    
    static compose(child: Route): Route {  // composes paths with slashes/in/them into full route objects
        const { path } = child;
        const [ segment, ...segments ] = `${path}`.split('/');
        
        if (!segments.length) return child;
        return {
            path: segment,
            children: [
                { ...child, path: segments.join('/') }
            ].map(Route.compose as ToDo) as Route[]
        } as Route;
    }
    
    static getPathnameParams(params: Record<string, string>, route: Route, segments: string[]): Record<string, string> {
        if (!segments.length) return params;
        const { path, abstracted, parent } = route;
        const segment = segments.pop();
        const param = path.replace(/^\{(\w+)\}$/, '$1');
        
        if (path === '#') return params;
        if (path === '**') return this.getPathnameParams({ ...params, '**': segment } as Record<string, string>, parent, segments);
        if ( abstracted) return this.getPathnameParams({ ...params, [param]: segment } as Record<string, string>, parent, segments);
        if (!abstracted) return this.getPathnameParams(params, parent, segments);
        return params;
    }
    
    static getAncestors(routes: Route[], route: Route): Route[] {  // #TCO
        const { parent, id } = route;
        if (id === '#') return [ route, ...routes ];
        return [ ...this.getAncestors(routes, parent), route ];
    }
    
    static handleHashchange = (e: HashChangeEvent) => {
        const { target } = this;
        const { type, oldURL, newURL } = e;
        const { hash: full } = new URL(newURL);
        const { pathname: uri, search: query } = new URL(`http://a.b.c${full.replace('#', '')}`);
        const path = `#${uri}`;
        const segments = path.split('/');
        const search = new URLSearchParams(query);
        const params = Object.fromEntries(search);
        const data = { uri, path, segments, query, search, params };
        const message = new MessageEvent('navigation', { data });
        
        target.dispatchEvent(message);
    };
    
    static handleMatch = (e: MessageEvent) => {
        const { type, data: details } = e;
        const { route, data } = details;
        const { path } = route;
        const { params, segments } = data;
        const parameters = this.getPathnameParams(params, route, [ ...segments ]);
        const routes = this.getAncestors([], route);
        const state = { route, data, params: parameters, routes };
        
        if (path === '#') warn( new Error(`Route Match Error: Only root route matched ("#"). Please consider adding a 404 route to handle "**" paths.`) );
        this.state = state;
        this.notify();
    };
    
    static init() {
        const { target } = this;
        const { hash, href } = location;
        const event = new HashChangeEvent('initial', { oldURL: href, newURL: href });
        
        this.initialized = true;
        this.init = () => {};
        target.addEventListener('match', this.handleMatch as ToDo, true);
        window.addEventListener('hashchange', this.handleHashchange, true);
        if (!hash) location.hash = '/';
        else this.handleHashchange(event);
    }
    
    static attach(observer, notify = true) {
        const { observers, state } = this;
        
        observers.add(observer);
        if (notify) observer.call(this, state);
        
        return this;
    }
    
    static detach(observer) {
        const { observers } = this;
        observers.delete(observer);
        return this;
    }
    
    static notify(state = this.state) {
        const { observers } = this as ToDo;
        observers.forEach( observer => observer.call(this, state) );
        return this;
    }
    
    link(child?: Route, ...more: Route[]) {
        if (!child) return;
        const { $children } = this;
        const route = new Route(child, this);
        
        $children.set(route.id, route);
        if (more.length) return this.link(...more);
    }
    
    handleEvent(e: MessageEvent) {
        const { id } = this;
        const { type, data } = e;
        const { segments } = data;
        const matches = this.isMatch([ ...segments ]);
        const details = { route: this, data };
        const message = new MessageEvent('match', { data: details });
        
        if (!matches) return;
        e.stopImmediatePropagation();  // prevent other potential matches from executing
        Route.target.dispatchEvent(message);
    }
    
    isMatch(segments: string[]) {
        if (!segments.length) return false;
        const { abstracted, path, parent } = this;
        const segment = segments.pop();
        
        if (path === '#') return true;  // root should always match and break continuation (because it is its own parent)
        if (segment === path) return parent.isMatch(segments);  // continue matching on ancestors (explicit take precedence)
        if (abstracted) return parent.isMatch(segments);  // a parameter will always match (and continue)
        if (path === '**') return parent.isMatch(segments);
        return false;
    }
    
}