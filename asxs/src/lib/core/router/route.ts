
import type { ToDo } from '@asxs/core/types';
import { customElement } from '@asxs/core/customelement';

type Observer = ObserverObject | ObserverFunction;
type ObserverFunction = (this: RouteElement, state: ObserverFunction) => any;

interface ObserverObject {
    call(this: any, router: typeof RouteElement, state: State): any;
}

interface State {
    route: RouteElement;
    data: ToDo;
    params: Record<string, string>;
    routes: RouteElement[];
}

const { log, warn, error: err } = console;

export type { Observer, State };
export const TAGNAME = 'as-route'; 
export @customElement(TAGNAME) class RouteElement extends HTMLElement {
    static target: EventTarget = new EventTarget();
    static observers: Set<Observer> = new Set();
    static state: State = { route: {} as RouteElement, data: {}, params: {}, routes: [] };
    static routes: Map<string, RouteElement> = new Map();
    static initialized: boolean = false;
    abstracted: boolean = false;
    id: string = '';
    path: string = '';
    name: string = 'ANONYMOUS';
    view: string = 'as-route-error';
    data: any = {};
    parent: RouteElement = this;
    $descendants: Map<string, RouteElement> = new Map();
    get descendants(): RouteElement[] { return [ ...this.$descendants.values() ] }
    
    constructor(route: Partial<RouteElement> = {}, parent?: RouteElement) {
        super();
        const { path, name, view, data, descendants } = { descendants: [], ...(this as ToDo), ...route };
        const id = parent ? `${parent.id}/${path}` : '#';
        const descendents = descendants.map(RouteElement.compose);
        const abstracted = /^\{\w+\}$/.test(path);
        var ancestor = parent || this;
        
        RouteElement.routes.set(id, this);
        this.abstracted = abstracted;
        this.id = id;
        this.path = path;
        this.name = name;
        this.view = view;
        this.data = data;
        this.parent = ancestor;
        this.link(...descendents);
        RouteElement.target.addEventListener('navigation', this, true);
        
        return this;
    }
    
    static compose(child: RouteElement): RouteElement {  // composes paths with slashes/in/them into full route objects
        const { path } = child;
        const [ segment, ...segments ] = `${path}`.split('/');
        
        if (!segments.length) return child;
        return {
            path: segment,
            descendants: [
                { ...child, path: segments.join('/') }
            ].map(RouteElement.compose as ToDo) as RouteElement[]
        } as RouteElement;
    }
    
    static getPathnameParams(params: Record<string, string>, route: RouteElement, segments: string[]): Record<string, string> {
        if (!segments.length) return params;
        const { path, abstracted, parent } = route;
        const segment = segments.pop();
        const param = path.replace(/^\{(\w+)\}$/, '$1');
        
        if (path === '#') return params;
        if (path === '**') return RouteElement.getPathnameParams({ ...params, '**': segment } as Record<string, string>, parent, segments);
        if ( abstracted) return RouteElement.getPathnameParams({ ...params, [param]: segment } as Record<string, string>, parent, segments);
        if (!abstracted) return RouteElement.getPathnameParams(params, parent, segments);
        return params;
    }
    
    static getAncestors(routes: RouteElement[], route: RouteElement): RouteElement[] {  // #TCO
        const { parent, id } = route;
        if (id === '#') return [ route, ...routes ];
        return [ ...RouteElement.getAncestors(routes, parent), route ];
    }
    
    static handleHashchange = (e: HashChangeEvent) => {
        const { target } = RouteElement;
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
        const parameters = RouteElement.getPathnameParams(params, route, [ ...segments ]);
        const routes = RouteElement.getAncestors([], route);
        const state = { route, data, params: parameters, routes };
        
        if (path === '#') warn( new Error(`RouteElement Match Error: Only root route matched ("#"). Please consider adding a 404 route to handle "**" paths.`) );
        RouteElement.state = state;
        RouteElement.notify();
    };
    
    static init(): typeof RouteElement {
        const { target } = RouteElement;
        const { hash, href } = location;
        const event = new HashChangeEvent('initial', { oldURL: href, newURL: href });
        
        RouteElement.initialized = true;
        RouteElement.init = () => RouteElement;
        target.addEventListener('match', RouteElement.handleMatch as ToDo, true);
        window.addEventListener('hashchange', RouteElement.handleHashchange, true);
        if (!hash) location.hash = '/';
        else RouteElement.handleHashchange(event);
        
        return RouteElement;
    }
    
    static attach(observer: Observer, notify: boolean = true): typeof RouteElement {
        const { observers, state } = RouteElement;
        
        observers.add(observer);
        if (notify) observer.call(RouteElement, state);
        
        return RouteElement;
    }
    
    static detach(observer: Observer): typeof RouteElement {
        const { observers } = RouteElement;
        observers.delete(observer);
        return RouteElement;
    }
    
    static notify(state: State = RouteElement.state): typeof RouteElement {
        const { observers } = RouteElement;
        observers.forEach( observer => observer.call(RouteElement, state) );
        return RouteElement;
    }
    
    link(child?: RouteElement, ...more: RouteElement[]): RouteElement {
        if (!child) return child as unknown as RouteElement;
        const { $descendants } = this;
        const route = new RouteElement(child, this);
        
        $descendants.set(route.id, route);
        if (more.length) return this.link(...more);
        return route;
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
        RouteElement.target.dispatchEvent(message);
    }
    
    isMatch(segments: string[]): boolean {
        if (!segments.length) return false;
        const { abstracted, path, parent } = this;
        const segment = segments.pop();
        
        if (path === '#') return true;  // root should always match and break continuation (because it is its own parent)
        if (segment === path) return parent.isMatch(segments);  // continue matching on ancestors (explicit take precedence)
        if (abstracted) return parent.isMatch(segments);  // a parameter will always match (and continue)
        if (path === '**') return parent.isMatch(segments);
        return false;
    }
    
};
