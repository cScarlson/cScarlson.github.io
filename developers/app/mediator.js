
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
        this.publish(channel, payload);
    }
    
    dispatch(channel, payload) {
        const { clients } = this;
        clients.forEach( port => port.postMessage([ channel, payload ]) );
        return this;
    }
    
    publish(channel, payload) {
        this.dispatch('WORKER:EVENT:LOG', { channel, payload, handled: (channel in this) });
        if (channel in this) this[channel](channel, payload);
        else this.dispatch(channel, payload);
        
        return this;
    }
    
    ['MENU:ACTION'](channel, request) {
        const { active, content: template } = request;
        if (active) this.dispatch('SIDELOAD:REQUEST', { ...request, type: 'template', template });
    }
    
    ['ASCII:TILE:SELECTION'](channel, request) {
        const { active } = request;
        if (active) this.dispatch('SIDELOAD:REQUEST', { ...request, type: 'template' });
    }
    
    ['SIDELOAD:REQUEST:COMPLETE'](channel, request) {
        const { id } = request;
        if (id === 'ascii:tile') this.dispatch('ASCII:TILE:DESELECTION', request);
        if (id === 'app:menu') this.dispatch('MENU:DISMISSED', request);
    }
    
})();
