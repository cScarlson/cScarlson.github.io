
import { $, config } from './app/core.js';
import { Route } from './app/children/router/route.js';
import { default as schema } from './app/routes.js';

const { console, navigator } = window;
const { log, error: err } = console;
const { serviceWorker } = navigator;
const root = new Route(schema);
const clicks = {
    handleEvent(e) {
        if ( !e.target.matches('dialog.sideload.modal a.link.control') ) return;
        $.sandbox.publish('SIDELOAD:DISMISS');  // to dismiss sideload
        $.sandbox.publish('MENU:DISMISSED');  // to uncheck menu toggle
    }
};

function logEvents(e) {
    const { type, data } = e;
    const { channel, payload, handled } = data;
    log(`@"${type}"`, channel, `handled: ${handled}`, payload);
}

function observeLocation(state) {
    if (!this.initialized) return;
    const { route, data, params, routes } = state;
    const { id, target } = route;
    const { path } = data;
    const root = this.routes.get('#');
    
    log(`@observeLocation`, id === path, id, path, target, params, routes);
}

function handleFulfilled(registration) {
    log(`Service Worker successfully registered`, registration);
    // setTimeout(x => registration.update(), 10_000)
}

function handleRejected(error) {
    err(`Service Worker registeration FAILED`, error);
}

if (serviceWorker) serviceWorker.register('./worker.service.js', { type: 'module' }).then(handleFulfilled, handleRejected);
else log(`Service Workers not supported`);
config.set('@root', '/developers/');
$.sandbox.subscribe('WORKER:EVENT:LOG', logEvents);
window.addEventListener('click', clicks, true);
Route.attach(observeLocation).init();
