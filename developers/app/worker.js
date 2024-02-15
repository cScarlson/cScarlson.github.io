
import { Mediator } from './mediator.js';

const { log } = console;
const SOURCE = 'cScarlson.github.io';
const worker = new (class Worker extends Mediator {
    medium = self;
    
    constructor() {
        super();
        this.medium.addEventListener('message', this);
    }
    
    handleMessage(e) {
        const { data = {} } = e;
        const { channel, payload } = data;
        this.publish(channel, payload);
    }
    
    dispatch(channel, payload) {
        this.medium.postMessage({ source: SOURCE, channel, payload });
        return this;
    }
    
})();
