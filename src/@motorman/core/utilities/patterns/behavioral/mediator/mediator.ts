
import { EventHub } from './eventhub';
class Mediator extends EventHub {
    private publishers: any = { };
    private subscribers: any = { };
        
    constructor() {
        super();
    }
    
    private registerPublisher(channel: string, publisher: Function) {
        this.publishers[channel] = publisher;
        return this;
    }
    
    private registerSubscriber(channel: string, subscriber: Function) {
        this.subscribers[channel] = subscriber;
        return this;
    }
    
    // protected
    register(type: string, map: Function) {
        var method = { 'publishers': this.registerPublisher, 'subscribers': this.registerSubscriber }[ type ];
        for (let channel in map) method.call(this, channel, map[channel]);
        return this;
    }
    
    // protected
    dispatch(channel: string, data?: any, ...more: any[]) {
        super.publish.call(this, channel, data, ...more);
        return this;
    }
    
    // protected
    listen(channel: string, handler: Function) {
        super.subscribe(channel, handler);
        return this;
    }
    
    publish(channel: string, data?: any, ...more: any[]) {
        if (!channel) throw new Error("Subscription Error: Channel not provided.");
        if (channel in this.publishers) this.publishers[ channel ].call(this, channel, data );
        else this.dispatch.call(this, channel, data, ...more);
        
        return this;
    }
    
    subscribe(channel: string, handler: Function) {
        if (!channel || !handler || !handler.call) throw new Error("Subscription Error: Channel or Handler not provided.");
        if (channel in this.subscribers) this.subscribers[ channel ].call(this, channel, handler);
        else this.listen(channel, handler);
        
        return this;
    }
    
    unsubscribe(channel: string, handler: Function) {
        super.unsubscribe(channel, handler);
        return this;
    }
        
}

export { Mediator };
