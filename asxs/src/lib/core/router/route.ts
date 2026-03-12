
import type { ToDo } from '@asxs/core/types';
import { customElement, PageElement } from '@asxs/core';

type Observer = ObserverObject | ObserverFunction;
type ObserverFunction = (this: Route, state: ObserverFunction) => any;

interface ObserverObject {
    call(this: any, router: typeof Route, state: State): any;
}

interface State {
    route: Route;
    data: ToDo;
    params: Record<string, string>;
    routes: Route[];
}

const { log, warn, error: err } = console;

export type { ObserverFunction, ObserverObject, Observer, State };
export const TAGNAME = 'as-route';
export @customElement(TAGNAME) class Route extends PageElement {
    static target: EventTarget = new EventTarget();
    static observers: Set<Observer> = new Set();
    static state: State = { route: {} as Route, data: {}, params: {}, routes: [] };
    static routes: Map<string, Route> = new Map();
    static initialized: boolean = false;
    bookmark: boolean = false;
    abstracted: boolean = false;
    id: string = '#';
    path: string = '';
    name: string = 'ANONYMOUS';
    data: any = {};
    parent: Route = this;
    _descendants: Route[] = [];
    $descendants: Map<string, Route> = new Map();
    get descendants(): Route[] { return [ ...this.$descendants.values() ] }
    
    constructor(route: Partial<Route> = {}) {
        super();
        const { id, path, name, data } = { ...this, ...route };
        const { descendants = [] } = route;
        const { dataset } = this;
        const abstracted = /^\{\w+\}$/.test(path);
        
        dataset.path = path;
        dataset.name = name;
        this.abstracted = abstracted;
        this.id = id;
        this.path = path;
        this.name = name;
        this.data = data;
        this._descendants = descendants;
        this.append(...descendants);
        Route.target.addEventListener('navigation', this, true);
        this.init();
        
        return this;
    }
    
    static getPathnameParams(params: Record<string, string>, route: Route, segments: string[]): Record<string, string> {
        if (!segments.length) return params;
        const { path, abstracted, parent } = route;
        const segment = segments.pop();
        const param = path.replace(/^\{(\w+)\}$/, '$1');
        
        if (path === '#') return params;
        if (path === '**') return Route.getPathnameParams({ ...params, '**': segment } as Record<string, string>, parent, segments);
        if ( abstracted) return Route.getPathnameParams({ ...params, [param]: segment } as Record<string, string>, parent, segments);
        if (!abstracted) return Route.getPathnameParams(params, parent, segments);
        return params;
    }
    
    static getAncestors(routes: Route[], route: Route): Route[] {  // #TCO
        const { parent, id } = route;
        if (id === '#') return [ route, ...routes ];
        return [ ...Route.getAncestors(routes, parent), route ];
    }
    
    static handleHashchange = (e: HashChangeEvent, p = e.preventDefault()) => {
        const { target } = Route;
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
        const parameters = Route.getPathnameParams(params, route, [ ...segments ]);
        const routes = Route.getAncestors([], route);
        const state = { route, data, params: parameters, routes };
        
        Route.state = state;
        Route.notify();
    };
    
    static init = setTimeout.bind(window, (options: Partial<ToDo> = {}) => {
        const { target } = Route;
        const { hash, href } = location;
        const event = new HashChangeEvent('initial', { oldURL: href, newURL: href });
        
        Route.initialized = true;
        (Route as ToDo).init = () => Route;
        target.addEventListener('match', Route.handleMatch as ToDo, true);
        window.addEventListener('hashchange', Route.handleHashchange, true);
        if (!hash) location.hash = '/';
        else Route.handleHashchange(event);
        
        return Route;
    }, 1_000 * 0.25);
    
    static attach(observer: Observer, notify: boolean = true): typeof Route {
        const { observers, state } = Route;
        
        observers.add(observer);
        if (notify) observer.call(Route, state);
        
        return Route;
    }
    
    static detach(observer: Observer): typeof Route {
        const { observers } = Route;
        observers.delete(observer);
        return Route;
    }
    
    static notify(state: State = Route.state): typeof Route {
        const { observers } = Route;
        observers.forEach( observer => observer.call(Route, state) );
        return Route;
    }
    
    init = setTimeout.bind(window, (options: ToDo = {}, parent: Route = this) => {
        const { parentElement, path } = this;
        const [ segment, ...segments ] = path.split('/');
        const route = this.fractionate(segment, ...segments);
        
        this.setAttribute('slot', 'as:routelet');
        if (parentElement && parentElement instanceof Route) setTimeout(x => parentElement.adopt(route), 0);
        Route.routes.set(this.id, this);
        setTimeout(x => this.innerHTML = '', 0);
    }, 0);
    
    fractionate(segment: string, ...more: string[]): Route {
        if (!more.length) return this;
        const predecessor = new Route({ path: segment, descendants: [  ] });
        
        this.path = more.join('/');
        this.replaceWith(predecessor);
        predecessor.appendChild(this);
        predecessor._descendants.push(this);
        this.init();
        
        return predecessor;
    }
    
    adopt(child: Route) {
        if (this.parentElement) (this.parentElement as Route).adopt(this);
        if (this.parentElement) this.id = `${this.parentElement.id}/${this.path}`;
        const { id, $descendants } = this;
        const { id: idenfifier, path, } = child;
        
        child.id = `${id}/${path}`;
        child.parent = this;
        $descendants.set(idenfifier, child);
    }
    
    link(child?: Route, ...more: Route[]): Route {
        if (!child) return child as unknown as Route;
        const { $descendants } = this;
        
        child.parent = this;
        $descendants.set(child.id, child);
        if (more.length) return this.link(...more);
        return child;
    }
    
    #handleNavigation(e: MessageEvent) {
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
    
    handleEvent(e: MessageEvent) {
        if (e.type === 'navigation') return this.#handleNavigation(e);
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
    
    createRenderRoot(): ShadowRoot | HTMLElement {
        return this;
    }
    
    connectedCallback( x = super.connectedCallback() ) {
        const connected = new MessageEvent('as:route:connected', { bubbles: true });
        this.dispatchEvent(connected);  // fires after initial render/update has occurred
    }
    
    disconnectedCallback( x = super.disconnectedCallback() ) {}
    
    remove(): void {
        const { descendants } = this;
        for (const child of descendants) if (child.isConnected) child.remove();
        super.remove();
    }
    
};
