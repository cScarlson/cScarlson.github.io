
import type { ToDo } from '@asxs/core/types';
import { customElement, CustomElement } from '@asxs/core';
import { type ObserverObject, type State } from './route';
import { Route, Route as Router } from './route';

const { log, warn, error: err } = console;

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
    
    #render(state: State, route: Route) {
        if (route === this.#root) return;
        this.#root.remove();
        this.current = state;
        this.#root = this.#append(route);
    }
    
    call(router: typeof Router, state: State) {
        if ( !(state.route instanceof Route) ) return;
        const { route } = state;
        const { parent } = route;
        
        if (route.bookmark) this.#render(state, parent);
        else this.#render(state, route);
    }
    
    connectedCallback() {
        Router.attach(this, true);
    }
    
    disconnectedCallback() {
        Router.detach(this);
    }
    
};
