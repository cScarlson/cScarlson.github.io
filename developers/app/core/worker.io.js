
const { log } = console;
const SOURCE = 'cScarlson.github.io';

export class Worker {
    worker = null;
    medium = new EventTarget();
    
    constructor({ worker }) {
        this.worker = worker;
        worker.addEventListener('message', this.handleMessage, true);
    }
    
    handleMessage = (e) => {
        if (e.data?.source !== SOURCE) return;
        const { type, data = {} } = e;
        const { source, channel, payload } = data;
        const event = new MessageEvent(channel, { data: payload });
        
        this.medium.dispatchEvent(event);
    };
    
    publish(channel, payload) {
        const { worker } = this;
        worker.postMessage({ source: SOURCE, channel, payload });
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
    
};
