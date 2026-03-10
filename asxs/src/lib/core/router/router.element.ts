
import type { ToDo } from '@asxs/core/types';
import { customElement, CustomElement } from '@asxs/core';
import { type ObserverObject, type State } from './route';
import { Route, Route as Router } from './route';
import { RouteElement } from './route.element';

const { log, warn, error: err } = console;

class RouterElementError extends Error {
    
    constructor(public options: State = {} as State) {
        super( get() );
        
        function get() {
            const { route } = options;
            const { id, path, name, tagName } = route;
            return `RouterElementError Error: route failed to construct element "${tagName}" at route "${id}" ("${name}") at path "${path}".`;
        }
        
    }
    
}

export const TAGNAME = 'as-router';
export @customElement(TAGNAME, { extends: 'main' }) class RouterElement extends HTMLElement implements ObserverObject {
    static CHANNEL_ROUTE_CONNECTED: 'as:route:connected' = 'as:route:connected';
    current: State = {} as State;
    #root: Route = document.createElement('div') as unknown as Route;
    
    #append(leaf: Route) {
        if (leaf.parent === leaf) return this.appendChild(leaf);
        const { parent } = leaf;
        
        function handle(e: MessageEvent) {
            if (e.target !== leaf) parent.appendChild(leaf);
            parent.removeEventListener(RouterElement.CHANNEL_ROUTE_CONNECTED, handle as ToDo, true);
        }
        
        parent.addEventListener(RouterElement.CHANNEL_ROUTE_CONNECTED, handle as ToDo, true);
        
        return this.#append(parent);
    }
    
    call(router: typeof Router, state: State) {
        if ( !(state.route instanceof Route) ) return;
        if (state.route.bookmark) return;
        const { route } = state;
        
        this.#root.remove();
        this.current = state;
        this.#root = this.#append(route);
    }
    
    connectedCallback() {
        Router.attach(this, true);
    }
    
    disconnectedCallback() {
        Router.detach(this);
    }
    
};
