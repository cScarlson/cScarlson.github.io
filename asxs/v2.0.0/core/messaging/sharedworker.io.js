
const { log } = console;

export class SharedWorker {
    worker = null;
    medium = new EventTarget();
    
    constructor({ worker }) {
        const { port } = worker;
        this.worker = worker;
        port.start();
        port.addEventListener('message', this.handleMessage, true);
    }
    
    handleMessage = (e) => {
        const { type, data = [] } = e;
        const [ channel, payload ] = data;
        const event = new MessageEvent(channel, { data: payload });
        
        this.medium.dispatchEvent(event);
    };
    
    publish(channel, data) {
        const { worker } = this;
        worker.port.postMessage([ channel, data ]);
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
