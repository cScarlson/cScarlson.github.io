
const { log } = console;
export class Mediator {
    
    handleEvent(e) {
        const { type } = e;
        const { [type]: handle } = {
            'connect': this.handleConnect,
            'message': this.handleMessage,
        };
        
        if (handle) handle.call(this, e);
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
    
}
