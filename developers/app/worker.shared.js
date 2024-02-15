
import { Mediator } from './mediator.js';

const { log } = console;
const sharedworker = new (class SharedWorker extends Mediator {
    medium = self;
    clients = new Set();
    
    constructor() {
        super();
        this.medium.addEventListener('connect', this);
    }
    
    handleConnect(e) {
        const { clients } = this;
        const { ports } = e;
        const [ port ] = ports;
        
        clients.add(port);
        port.addEventListener('message', this);
        port.start();
    }
    
    handleMessage(e) {
        const { data = [] } = e;
        const [ channel, payload ] = data;
        this.publish(channel, payload);
    }
    
    dispatch(channel, payload) {
        const { clients } = this;
        clients.forEach( port => port.postMessage([ channel, payload ]) );
        return this;
    }
    
})();
