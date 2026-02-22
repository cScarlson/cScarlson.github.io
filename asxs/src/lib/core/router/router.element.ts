
import { customElement } from '@asxs/core/customelement';
import { RouteElement as Router, type State } from './route';

const { log, warn, error: err } = console;

export const TAGNAME = 'as-router';
export @customElement(TAGNAME, { extends: 'output' }) class RouterElement extends HTMLOutputElement {
    
    call(router: typeof Router, state: State) {
        if ( !(state.route instanceof Router) ) return;
        log(`@ROUTE-CHANGE`, state.route.name);
    }
    
    connectedCallback() {
        log(`@${TAGNAME}`);
        Router.attach(this, true);
    }
    
};
