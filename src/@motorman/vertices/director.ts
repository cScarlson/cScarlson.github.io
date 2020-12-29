
class Director {
    static target = new EventTarget();

    constructor() {}

    publish(channel, data, ...more) {
        var e = new CustomEvent(channel, { detail: data });
        Director.target.dispatchEvent(e);
        return this;
    }

    subscribe(channel, handler) {
        Director.target.addEventListener(channel, handler, false);
        return this;
    }

    unsubscribe(channel, handler) {
        Director.target.removeEventListener(channel, handler, false);
        return this;
    }
    
}

export { Director };
