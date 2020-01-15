
var DEFAULT_DESCRIPTOR = { writable: true, configurable: true, enumerable: false };

function Element(details: any, options?: any): any {
    var details = { ...details, options, type: 'element' };
    var { template } = details;
    // var { templateUrl, template = require(templateUrl) } = details;
    // console.log('@Element', details, templateUrl, template);
    
    return function get(Class: any): any {
        Class.template = template;
        return { ...details, Class };
    };
}

function Service() {}

function attr(attr?: string): any {
    
    return function get(target: any, name: string, descriptor: any): any {
        var { constructor } = target;
        var descriptor = { ...descriptor, ...DEFAULT_DESCRIPTOR };
        
        constructor.observedAttributes = constructor.observedAttributes || [ ];
        constructor.observedAttributes.push(name);
        
        // return descriptor;
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
        var { value: handler } = descriptor;
        
        constructor.subscriptions = constructor.subscriptions || [ ];
        constructor.subscriptions.push({ type: channel, name, handler, operators: ops });
        
        return descriptor;
    };
}
function pipe(operator: any): any {
    
    return function get(target: any, name: string, descriptor: any) {
        var { constructor } = target;
        var descriptor = { ...descriptor, ...DEFAULT_DESCRIPTOR };
        
        constructor.operators = constructor.operators || [ ];
        constructor.operators.push({ operator, name });
        
        return descriptor;
    };
}

export { Element };
export { attr, watch };
export { handler };
export { message, pipe };
