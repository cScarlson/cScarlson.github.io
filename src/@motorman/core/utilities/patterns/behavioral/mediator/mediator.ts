
import { EventHub } from './eventhub';
class Mediator extends EventHub {
    private publishers: any = { };
    private subscribers: any = { };
        
    constructor() {
        super();
    }
    
    private registerPublisher(channel, publisher) {
        this.publishers[channel] = publisher;
        return this;
    }
    
    private registerSubscriber(channel, subscriber) {
        this.subscribers[channel] = subscriber;
        return this;
    }
    
    // protected
    register(type, map) {
        var method = { 'publishers': this.registerPublisher, 'subscribers': this.registerSubscriber }[ type ];
        for (let channel in map) method.call(this, channel, map[channel]);
        return this;
    }
    
    // protected
    dispatch(channel, data) {
        super.publish.call(this, channel, data );
        return this;
    }
    
    // protected
    listen(channel, handler) {
        super.subscribe(channel, handler);
        return this;
    }
    
    publish(channel, data) {
        if (!channel) throw new Error("Subscription Error: Channel not provided.");
        if (channel in this.publishers) this.publishers[ channel ].call(this, channel, data );
        else this.dispatch.call(this, channel, data );
        
        return this;
    }
    
    subscribe(channel, handler) {
        if (!channel || !handler || !handler.call) throw new Error("Subscription Error: Channel or Handler not provided.");
        if (channel in this.subscribers) this.subscribers[ channel ].call(this, channel, handler);
        else this.listen(channel, handler);
        
        return this;
    }
    
    unsubscribe(channel, handler) {
        super.unsubscribe(channel, handler);
        return this;
    }
        
}

export { Mediator };
