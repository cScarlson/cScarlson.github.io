
class Handler {
    handleResponsibility(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    }
}

/**
 * @intention 
 * @usage 
 *  * var cor = new ChainOfResponsibility({ ... });  // see config/constructor
 *  * cor.push({ handleResponsibility(e) {...} });
 *  * cor.push({ handleResponsibility(e) { e.stopPropagation(); return false } }, { handleResponsibility(e) {...} }, ...);
 *  * [EventTarget].addEventListener('click', cor.handleResponsibility.bind(cor), false);  // only 1st 2 handlers get invoked
 */
class ChainOfResponsibility {
    private config: any = { cancelable: false, bubbles: true };
    private handlers: Function[] = [ ];
        
    constructor(config) {
        var { bubbles, cancelBubble, cancelable, defaultPrevented } = config;
        this.config = { ...this.config, ...config };
    }
    
    private propagate(e, handler, i, handlers) {  // TODO: use Recursion to avoid unnecessary iterations
        if (e.cancelBubble) return e;
        var { config } = this;
        var value = handler.handleResponsibility.call(handler, e)
          , cancelBubble = !{ 'undefined': true, 'false': false }[ value ]
          ;
        if (config.cancelable && cancelBubble) ( e.stopPropagation(), e.stopImmediatePropagation() );
        e.eventPhase = i;
        
        return e;
    }
    
    chain(handler, ...handlers) {
        this.handlers.push(handler, ...handlers);
        return this;
    }
    
    handleResponsibility(e) {
        var result = this.handlers.reduce( this.propagate.bind(this), e );
        return result;  // subclasses can implement return result.cancelBubble or return false;
    }
    
}

export { ChainOfResponsibility, Handler };
