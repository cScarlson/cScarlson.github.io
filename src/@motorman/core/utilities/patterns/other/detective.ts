
interface IDetector {
    detect(e: CustomEvent): any;
}

/**
 * @intention
 *  Provide a means to subscribe to specific actions on specific data on an object.
 * @KnownIssues
 *  * Only works for set-operations
 * @usage
 * var detector = {
 *    detect(e) {
 *        console.log('Detector.detect', e.type, e.detail);
 *    }
 * };
* var detective = new Detective(object, detector);
* detective
*     .subscribe('name')
*     .subscribe('key')
*     .subscribe('param')
*     ;
* // |
* // | AND|OR
* // V
* var detective = new Detective(object[, detector]);
* detective.subscribe('name', (e) => console.log('#name', e.type, e.detail) );
* detective.subscribe('key', (e) => console.log('#key', e.type, e.detail) );
*/
class Detective {
    target: EventTarget = new EventTarget();
    proxy: typeof Proxy = new Proxy( new class Outlet {}, this);
    context: any = null;
    detector: IDetector = { detect(e) {} };
    
    constructor(context: any, detector?: IDetector) {
        var detector = detector || this.detector;
        
        this.context = context;
        this.detector = detector;
    }
    
    set(target: any, key: string, value: any, receiver: Detective) {
        var { target: emitter, proxy, detector } = this;
        var oldValue = proxy[key];
        var detail = { action: 'set', oldValue, value };
        var e = new CustomEvent(key, { detail });
        var result = Reflect.set(target, key, value, receiver);
        
        if (oldValue === value) return result;
        
        detector.detect(e);
        emitter.dispatchEvent(e);
        return result;
    }
    
    private getPropertyDescriptor(context: any, key: string) {
        var prototype = Object.getPrototypeOf(context);
        var dtor = Object.getOwnPropertyDescriptor(context, key);
        
        if (!dtor && !!prototype) return this.getPropertyDescriptor(prototype, key);
        return dtor;
    }
    
    private configure(key: string) {
        var { context, proxy, target } = this;
        var dtor = this.getPropertyDescriptor(context, key)
          , getter = dtor && dtor.get
          , setter = dtor && dtor.set
          ;
        var defaults = { configurable: true, enumerable: true };
        var config = { ...defaults, get: get.bind(context, key), set: set.bind(context, key) };
        
        function get(key) {
            var value = getter ? getter.call(context) : proxy[key];
            return value;
        }
        
        function set(key, value) {
            if (setter) setter.call(context, value);
            proxy[key] = value;
        }
        
        Object.defineProperty(context, key, config);
    }
    
    hasProperty(context: any, key: string) {
        var prototype = Object.getPrototypeOf(context);
        var has = context.hasOwnProperty(key);
        
        if (!has && !!prototype) return this.hasProperty(prototype, key);
        return has;
    }
    
    subscribe(key: string, handler?: Function) {
        var { target, proxy, context } = this;
        
        proxy[key] = context[key];  // ensure oldValue has initial/current before configuration
        this.configure(key);
        if (handler) target.addEventListener(key, <EventListenerOrEventListenerObject>handler, false);
        
        return this;
    }
    
}

export { Detective };
  