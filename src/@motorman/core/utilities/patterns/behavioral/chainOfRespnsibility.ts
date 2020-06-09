
class Handler {
    respond(e: CustomEvent): any {
        return e.detail;  // continue and provide same value (see Function Purity)
    }
}

/**
 * @name: The Chain of Responsibility Pattern
 * @intention
 * 	* Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle the request. Chain
 * 	* the receiving objects and pass the request along the chain until an object handles it.
 * @usage 
 *  * var cor = new ChainOfResponsibility({ ... });  // see config/constructor
 *  * cor.push({ respond(e) {...} });
 *  * cor.push({ respond(e) { e.stopImmediatePropagation(); return false; } }, { respond(e) {...} }, ...);
 *  *  -- OR --
 *  * private nodeHandlers: ChainOfResponsibility = new ChainOfResponsibility({}, [
 *  *     { respond: (e: CustomEvent) => console.log('COR: A', e) },
 *  *     { respond: (e: CustomEvent) => console.log('COR: B', e) },
 *  *     { respond: (e: CustomEvent) => e.stopImmediatePropagation() },
 *  *     { respond: ({ detail: value }: CustomEvent) => console.log('COR: C', value) },  // <-- never runs. propagation stopped.
 *  * ]);
 *  * -- INITIALIZE --
 *  * [EventTarget].addEventListener('click', cor.respond, false);  // only 1st 2 handlers get invoked. propagation stopped.
 *  * -- OR --
 *  * cor.execute( new CustomEvent('some:process:id', { detail: data }) );
 * @note
 *  * Can be used to simply give multiple objects a chance to receive a request -- OR -- create a mutation pipeline.
 */
class ChainOfResponsibility extends Array {
    protected config: any = { cancelable: false, bubbles: true };
        
    constructor(config, responders: Handler[] = []) {
        super();
        var { bubbles, cancelBubble, cancelable, defaultPrevented } = config;
        
        this.config = { ...this.config, ...config };
        this.push(...responders);
        
        return this;
    }
    
    protected execute(e: CustomEvent, i: number = 0, handlers: Handler[] = this.slice()): CustomEvent {
        var handler = handlers[i] || new Handler();
        var result = this.propagate(e, handler, i, handlers);  // process & reassign in case of change
        var event = new CustomEvent(e.type, { detail: result }), next = handlers[i + 1];
        
        if (e.cancelBubble) event.stopImmediatePropagation();
        if (e.cancelBubble) return event;  // if cancelled, stop immediately. return with value from cancellor.
        if (next) return this.execute(event, ++i);  // has sibling handler. continue with new detail.
        return event;  // if end reached and event not cancelled
    }
    
    protected propagate(e: CustomEvent|any, handler: Handler, i: number, handlers: Handler[]): any {
        if (e.cancelBubble) return e;
        var { config } = this;
        var value = handler.respond.call(handler, e)
          , cancelBubble = !{ 'undefined': true, 'false': false }[ value ]
          ;
        if (config.cancelable && cancelBubble) e.stopImmediatePropagation();
        
        return value;
    }
    
    chain(handler: Handler, ...handlers: Handler[]): ChainOfResponsibility {
        this.push(handler, ...handlers);
        return this;
    }
    
    public respond = (e: CustomEvent<any>): CustomEvent<any> => {
        var event = this.execute(e);
        return event;  // subclasses can implement return result.cancelBubble or return false;
    };
    
}

export { ChainOfResponsibility, Handler };
