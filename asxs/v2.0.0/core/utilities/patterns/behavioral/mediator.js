
export class Mediator {
    #medium = new EventTarget();
    
    $dispatch(event) {
        this.#medium.dispatchEvent(event);
        return this;
    }
    
    dispatch(channel, data = {}) {
        const event = new MessageEvent(channel, { data });
        this.$dispatch(event);
        return this;
    }
    
    publish(channel, data) {
        if (channel in this) this[channel](channel, data);
        else this.dispatch(channel, data);
        return this;
    }
    
    subscribe(channel, handle) {
        this.#medium.addEventListener(channel, handle, true);
        return this;
    }
    
    unsubscribe(channel, handle) {
        this.#medium.removeEventListener(channel, handle, true);
        return this;
    }
    
};
