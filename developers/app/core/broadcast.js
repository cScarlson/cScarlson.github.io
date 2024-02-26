
const { log } = console
const SOURCE = 'cscarlson.github.io';

class BroadcastSingular {
    medium = new EventTarget();
    channel = null;
    
    constructor(options) {
        const { name } = { name: 'singular', ...options };
        const channel = new BroadcastChannel(name);
        this.channel = channel;
        channel.addEventListener('message', this, true);
    }
    
    handleEvent(e) {
        if (e.data?.source !== SOURCE) return;
        const { data: options = {} } = e;
        const { source, channel, payload: data } = options;
        const event = new MessageEvent(channel, { data });
        
        this.medium.dispatchEvent(event);
    }
    
    publish(channel, payload) {
        const { channel: medium } = this;
        const data = { source: SOURCE, channel, payload };
        
        medium.postMessage(data);
        return this;
    }
    
    subscribe(channel, handler) {
        this.medium.addEventListener(channel, handler, true);
        return this;
    }
    
    unsubscribe(channel, handler) {
        this.medium.removeEventListener(channel, handler, true);
        return this;
    }
    
}

class BroadcastMultiple {
    static SOURCE = 'cscarlson.github.io';
    medium = new EventTarget();
    
    handleEvent(e) {
        if (e.data?.source !== SOURCE) return;
        const { data: options = {} } = e;
        const { source, channel, payload: data } = options;
        const event = new MessageEvent(channel, { data });
        
        this.medium.dispatchEvent(event);
    }
    
    publish(channel, payload) {
        const medium = new BroadcastChannel(channel);
        const data = { source: SOURCE, channel, payload };
        
        medium.postMessage(data);
        return this;
    }
    
    subscribe(channel, handler) {
        const medium = new BroadcastChannel(channel);
        
        medium.addEventListener('message', this, true);
        this.medium.addEventListener(channel, handler, true);
        
        return this;
    }
    
    unsubscribe(channel, handler) {
        const medium = new BroadcastChannel(channel);
        
        medium.removeEventListener('message', this, true);
        this.medium.removeEventListener(channel, handler, true);
        
        return this;
    }
    
}

class Broadcast {
    medium = null;
    
    constructor({ name } = {}) {
        const medium = name ? new BroadcastSingular({ name }) : new BroadcastMultiple();
        this.medium = medium;
    }
    
    publish(channel, payload) {
        this.medium.publish(channel, payload);
        return this;
    }
    
    subscribe(channel, handler) {
        this.medium.subscribe(channel, handler);
        return this;
    }
    
    unsubscribe(channel, handler) {
        this.medium.unsubscribe(channel, handler);
        return this;
    }
    
}

export { Broadcast };
