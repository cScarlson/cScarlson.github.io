
var path = require('path');
var callsite = require('callsite');

var DEFAULT_DESCRIPTOR = { writable: true, configurable: true, enumerable: true };

function Element(details: any, options?: any): any {
    // console.log('@ Element', details.name);
    var stack = callsite(), requester = stack[1].getFileName();
    var details = { ...details, options, type: 'element' };
    var { template = '', lazy = 'undefined' } = details;
    var location = path.join( requester, template );
    var pTemplate: Promise<string> = {
        'undefined': () => Promise.resolve(template),  // promise whatever was provided
        // 'false': () => require(location),  // promise template from path (compiletime)
        // 'true': () => import(location),  // promise template from path (runtime)
        // 'fetch': () => fetch(location),  // is this any different than require() or import() ?
    }[ lazy ]();  // use as function so that require() and import() don't automatically run
    
    return function get(Class: any): any {
        Class.template = template;
        Class.pTemplate = pTemplate;
        return { ...details, Class };
    };
}

function Service() {}

function attr(attr?: string): any {
    
    return function get(target: any, name: string, descriptor: any = {}): any {
        var { constructor } = target;
        var { get, set } = descriptor, hasGetOrSet = !!(get || set);
        var descriptor = { ...descriptor };
        
        if (!hasGetOrSet) descriptor.writable = true;
        constructor.observedAttributes = constructor.observedAttributes || [ ];
        constructor.observedAttributes.push(name);
        
        return descriptor;
    };
}
function watch(attr: string): any {
    
    return function get(target: any, name: string, descriptor: any): any {
        var { constructor } = target;
        var descriptor = { ...descriptor, ...DEFAULT_DESCRIPTOR };
        var { value: handler } = descriptor;
        
        constructor.watchers = constructor.watchers || new Map();
        constructor.watchers.set(attr, { attr, name, handler });
        
        return descriptor;
    };
}

function handler(type: string): any {
    
    return function get(target: any, name: string, descriptor: any): any {
        var { constructor } = target;
        var descriptor = { ...descriptor, ...DEFAULT_DESCRIPTOR };
        var { value: handler } = descriptor;
        
        constructor.listeners = constructor.listeners || [ ];
        constructor.listeners.push({ type, name, handler });
        
        return descriptor;
    };
}

function message(channel: string, operators?: any|any[]): any {
    var pipes = [].concat(operators), ops = new Set(pipes);
    
    return function get(target: any, name: string, descriptor: any): any {
        var { constructor } = target;
        var descriptor = { ...descriptor, ...DEFAULT_DESCRIPTOR };
        var { value } = descriptor;
        
        constructor.subscriptions = constructor.subscriptions || [ ];
        constructor.subscriptions.push({ type: channel, name, value, operators: ops });
        
        return descriptor;
    };
}
function pipe(operator: any): any {
    
    return function get(target: any, name: string, descriptor: any): any {
        var { constructor } = target;
        var descriptor = { ...descriptor, ...DEFAULT_DESCRIPTOR };
        
        constructor.operators = constructor.operators || [ ];
        constructor.operators.push({ operator, name });
        
        return descriptor;
    };
}

function cashe$(options: any = {}): any {
    return function get(): any {};
}
function casheP(options: any = {}): any {
    return function get(): any {};
}

export { Element };
export { attr, watch };
export { handler };
export { message, pipe };
