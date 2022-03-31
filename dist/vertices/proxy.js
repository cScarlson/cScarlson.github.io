
import { LIFECYCLE_EVENTS } from './events.js';

const { log, warn, error } = console;
const { onmount, oninit, onchange } = LIFECYCLE_EVENTS;
const VERTEX_PROXY_CONTEXT_SENTINEL = 'v:proxy:context:sentinel';

class VertexProxyHandler {  // todo: for collections, return collection of proxy objects. for objects, return proxy. (break VertexProxyHandler into multiple classes).
    initialized = false;
    details = { };
    
    constructor(details) {
        this.details = details;
    }
    
    set(target, key, value, receiver) {
        if (!this.initialized) return this.setInitial(target, key, value, receiver);
        const { details } = this;
        const { v } = details;
        const result = this.reflect(target, key, value, receiver);
        
        v.publish(onchange, { target, key, value, details });
        
        return result;
    }
    
    get(target, key, receiver) {
        const { details } = this;
        const { module } = details;
        const value = module[key];
        const has = (key in target);
        
        if (has) return Reflect.get(target, key, receiver);  // prefer normative accessor
        if (value instanceof Function) return value.bind(module);  // allow vertices to invoke methods on its <module>
        return value;
    }
    
    setInitial(target, key, value, receiver) {
        const result = this.reflect(target, key, value, receiver);
        return result;
    }
    
    reflect(target, key, value, receiver) {
        const { details } = this;
        const { v } = details;
        var primitive = false
          , primitive = primitive || (typeof value === 'string')
          , primitive = primitive || (typeof value === 'number')
          , primitive = primitive || (typeof value === 'boolean')
          , primitive = primitive || (typeof value === 'undefined')
          , primitive = primitive || (typeof value === 'function')  // semantics `\_(*L*)_/`
          ;
        
        if ({ undefined: true, null: true }[ value ]) return Reflect.set(target, key, value, receiver);
        if (value instanceof Node) return Reflect.set(target, key, value, receiver);  // let DOM Nodes be DOM Nodes.
        if (value instanceof Array) return this.setArray(target, key, value, receiver);
        if (value instanceof Set) return this.setSet(target, key, value, receiver);
        if (value instanceof Map) return this.setMap(target, key, value, receiver);
        if (target instanceof Array && !isNaN(key)) return Reflect.set(target, key, new Proxy(value, this), receiver);  // setting an index
        if (VERTEX_PROXY_CONTEXT_SENTINEL in target && !primitive) return Reflect.set(target, key, new Proxy(value, this), receiver);
        
        return Reflect.set(target, key, value, receiver);
    }
    
    setArray(target, key, value, receiver) {
        const thus = this;
        const array = value.reduce(reduce, value);
        const proxy = new Proxy(array, this);
        const result = Reflect.set(target, key, proxy, receiver);
        
        function reduce(array, item, i) {
            const proxy = new Proxy(item, thus);
            array.splice(i, 1, proxy);
            return array;
        }
        
        return result;
    }
    
    setSet(target, key, value, receiver) {
        const thus = this;
        const values = [ ...value ];
        const set = values.reduce(reduce, value);
        const proxy = new Proxy(set, this);
        
        function reduce(set, item, i) {
            const proxy = new Proxy(item, thus);
            set.add(proxy).delete(item);
            return set;
        }
        
        return Reflect.set(target, key, proxy, receiver);
    }
    
    setMap(target, key, value, receiver) {
        const values = [ ...value.entries() ];
        const set = values.reduce(reduce, value);
        const proxy = new Proxy(set, this);
        
        function reduce(map, [key, item], i) {
            const proxy = new Proxy(item, thus);
            return map.set(key, proxy);
        }
        
        return Reflect.set(target, key, proxy, receiver);
    }
    
    init() {
        this.force(true);
        return this;
    }
    
    toggle() {
        this.force(!this.initialized);
        return this;
    }
    
    force(state) {
        this.initialized = state;
        return this;
    }
    
}
        
class CloneScopeProxyHandler {  // todo: move this outta here!
    details = { };
    get model() { return this.details.model }
    
    constructor(details) {
        this.details = details;
    }
    
    get(target, key, receiver) {
        const { model } = this;
        const has = (key in target);
        
        if (has) return Reflect.get(target, key, receiver);
        return model[key];
    }
    
}

class Context {
    get [VERTEX_PROXY_CONTEXT_SENTINEL]() {}
    [onmount]() {}
    [oninit]() {}
}

export { VertexProxyHandler, CloneScopeProxyHandler, Context };
