/**
 * THIS SHOULD ACTUALLY BE JUST AN EVENT-AGGREGATOR THAT CAN BE USED [PER USUAL] ACROSS
 * THE SYSTEM, WHILE A "WebSocketDecorator" CAN BE USED TO NORMALIZE THE EXTERNAL LIBRARY.
 */
var EventEmitter = EventTarget;
class EventHub extends EventEmitter {
    
    publish(channel: string, data?: any, ...more: any[]) {
        var e = new CustomEvent(channel, { detail: data });
        this.dispatchEvent(e);
        return this;
    }
    subscribe(channel: string, handler: any) {
        this.addEventListener(channel, handler, false);
        return this;
    }
    unsubscribe(channel: string, handler: any) {
        this.removeEventListener(channel, handler, false);  // what is 3rd param again?
        return this;
    }
    
}

export { EventHub };
