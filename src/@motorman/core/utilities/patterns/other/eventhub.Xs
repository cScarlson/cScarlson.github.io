
/**
 * @name: Event-Hub
 * @intention
 *  * Aggregate subscription objects that encapsulate a handler to invoke when publishments are made.
 * @patterns
 *  * { EventAggregator, PublishSubscribe }
 */
var EventHub = function EventHub(...params) {
    var PRIVATE = this;
    var channels = { };
    
    function publish(subscription, data, ...splat) {
        var { channel, handler, context } = subscription;
        handler.call(context, data, ...splat);
        return this;
    }
    function subscribe(subscription) {
        var { channel } = subscription;
        this.channels[channel].push(subscription);
        return this;
    }
    function unsubscribe(fn, subscription, i, subscriptions) {
        var { handler } = subscription;
        if (handler === fn) subscriptions.splice(i, 1);
        return this;
    }
    
    // export precepts
    this.channels = channels;
    this.publish = publish;
    this.subscribe = subscribe;
    this.unsubscribe = unsubscribe;
    
    return new (class EventHub {
        get channels() { return PRIVATE.channels; }
        
        constructor() {}
        
        publish(channel, data, ...splat) {
            if (!this.channels[channel]) this.channels[channel] = [ ];
            
            var subscriptions = this.channels[channel];
            for (let i = 0, len = subscriptions.length; i < len; i++) PRIVATE.publish(subscriptions[i], data, ...splat);
            
            return this;
        }
        subscribe(channel, handler) {
            if (!this.channels[channel]) this.channels[channel] = [ ];
            
            var subscription = { channel, handler, context: this };
            PRIVATE.subscribe(subscription);
            
            return this;
        }
        unsubscribe(channel, handler) {
            if (!this.channels[channel]) this.channels[channel] = [ ];
            
            var subscriptions = this.channels[channel];
            for (let i = subscriptions.length; i--;) PRIVATE.unsubscribe(handler, subscriptions[i], i, subscriptions);
            
            return this;
        }
        
    })(...params);
};

module.exports = { EventHub };
