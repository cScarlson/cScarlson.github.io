
import type { ToDo } from '@asxs/core/types';
import { customElement, CustomElement } from '@asxs/core';
import { RouteElement as Router, type State } from './route';

const { log, warn, error: err } = console;

class RouterElementError extends Error {
    
    constructor(public options: State = {} as State) {
        super( get() );
        
        function get() {
            const { route } = options;
            const { id, path, name, view } = route;
            return `RouterElementError Error: route failed to construct element "${view}" at route "${id}" ("${name}") at path "${path}".`;
        }
        
    }
    
}

export const TAGNAME = 'as-router';
export @customElement(TAGNAME, { extends: 'main' }) class RouterElement extends HTMLElement {
    
    call(router: typeof Router, state: State) {
        if ( !(state.route instanceof Router) ) return;
        if ( !customElements.get(state.route.view) ) throw new RouterElementError(state);
        const { route } = state;
        const { view: tagName } = route;
        const Class = customElements.get(tagName) as ToDo;
        const element = new Class(state);
        
        log(`@ROUTE-CHANGE`, state.route.name, state.route.path, state.route.view, element);
        this.appendChild(element);
    }
    
    connectedCallback() {
        log(`@${TAGNAME}`);
        Router.attach(this, true);
    }
    
};
