
const { log } = console;
const mediator = new (class Mediator {
    medium = self;
    clients = new Set();
    
    constructor() {
        this.medium.addEventListener('connect', this);
    }
    
    handleEvent(e) {
        const { type } = e;
        const { [type]: handle } = {
            'connect': this.handleConnect,
            'message': this.handleMessage,
        };
        
        if (handle) handle.call(this, e);
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
        
        if (channel in this) this[channel](channel, payload);
        else this.publish(channel, payload);
    }
    
    publish(channel, payload) {
        const { clients } = this;
        clients.forEach( port => port.postMessage([ channel, payload ]) );
        return this;
    }
    
    ['back'](channel, payload) {
        this.publish(channel, { ...payload, swapped: true });
    }
    
})();
