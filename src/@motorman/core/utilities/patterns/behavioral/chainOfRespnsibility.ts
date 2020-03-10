
class Handler {
    respond(e: CustomEvent): any {
        // e.preventDefault();
        // e.stopPropagation();
        // e.stopImmediatePropagation();
        // return false;
        return e.detail;
    }
}

/**
 * @intention 
 * @usage 
 *  * var cor = new ChainOfResponsibility({ ... });  // see config/constructor
 *  * cor.push({ respond(e) {...} });
 *  * cor.push({ respond(e) { e.stopPropagation(); return false } }, { respond(e) {...} }, ...);
 *  * [EventTarget].addEventListener('click', cor.respond.bind(cor), false);  // only 1st 2 handlers get invoked
 *  * 
    * private nodeHandlers: ChainOfResponsibility = new ChainOfResponsibility({}, [
    *     { respond: (e: CustomEvent) => console.log('COR: A', e) },
          { respond: (e: CustomEvent) => console.log('COR: B', e) },
          // { respond: (e: CustomEvent) => e.stopPropagation() },
          { respond: ({ detail: value }: CustomEvent) => console.log('COR: C', value) },
    * ]);
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
        
        if (e.cancelBubble) event.stopPropagation();
        if (e.cancelBubble) return event;  // if cancelled, stop immediately. return with value from cancellor.
        if (next) return this.execute(event, ++i);  // has sibling handler. continue with new detail.
        return event;  // if end reached and event not cancelled
    }
    
    protected propagate(e: CustomEvent|any, handler: Handler, i: number, handlers: Handler[]): any {  // TODO: use Recursion to avoid unnecessary iterations
        if (e.cancelBubble) return e;
        var { config } = this;
        var value = handler.respond.call(handler, e)
          , cancelBubble = !{ 'undefined': true, 'false': false }[ value ]
          ;
        if (config.cancelable && cancelBubble) ( e.stopPropagation(), e.stopImmediatePropagation() );
        // e.eventPhase = i;
        
        return value;
    }
    
    chain(handler: Handler, ...handlers: Handler[]): ChainOfResponsibility {
        this.push(handler, ...handlers);
        return this;
    }
    
    respond(e: CustomEvent<any>): CustomEvent<any> {
        var event = this.execute(e);
        // var result = this.reduce( this.propagate.bind(this), e );
        return event;  // subclasses can implement return result.cancelBubble or return false;
    }
    
}

export { ChainOfResponsibility, Handler };
