
class EventManager {
    dispatcher = new EventTarget();
    target = null;
    types = [ ];
    delegate = () => {};
    getDelegate = (e, operation) => (new Function('$event', 'o', `with (o) return o.${operation};`)).bind(e, e);

    constructor(options) {
        var { target, handler } = options;
        this.target = target;
        this.delegate = handler;
    }
        
    getEventTypes(template) {
        var re = /\(([^()]+)\)=/img;
        var matches = (template.match(re) || []).map( match => match.replace(re, '$1') );
        return matches;
    }

    bind(template) {
        var { target } = this;
        var types = this.getEventTypes(template);
        
        this.unbind();
        this.types = types;
        this.types.forEach( (type) => target.addEventListener(type, this.handleEvent, true) );
        
        return this;
    }
    unbind() {
        var { target, types } = this;
        types.forEach( (type) => target.removeEventListener(type, this.handleEvent, false) );
        return this;
    }

    handleEvent = (e) => {
        if ( !e.target.hasAttribute(`(${e.type})`) ) return true;
        var { dispatcher, getDelegate } = this;
        var { type, target } = e;
        var { attributes } = target;
        var name = `(${type})`;
        var attr = attributes[name];
        var { value } = attr;
        var delegate = getDelegate(e, value);
        var detail = { event: e, type, attr, delegate };
        var event = new CustomEvent('*', { detail });
        
        dispatcher.dispatchEvent(event);
    };

    subscribe(channel, handler) {
        this.dispatcher.addEventListener(channel, handler, false);
        return this;
    }

}

export { EventManager };
