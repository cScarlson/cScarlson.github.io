
type Handler = EventListenerOrEventListenerObject | any;

interface PublishSubscribable {
    publish(channel: string, data: any): PublishSubscribable;
    subscribe(channel: string, handle: Handler): PublishSubscribable;
    unsubscribe(channel: string, handle: Handler): PublishSubscribable;
}

export type { Handler, PublishSubscribable };
export class Mediator implements PublishSubscribable {
    #medium: EventTarget = new EventTarget();
    
    $dispatch(event: Event): Mediator {
        this.#medium.dispatchEvent(event);
        return this;
    }
    
    dispatch(channel: string, data: any = {}): Mediator {
        const event = new MessageEvent(channel, { data });
        this.$dispatch(event);
        return this;
    }
    
    publish(channel: string, data: any): PublishSubscribable {
        if (channel in this) this[channel](channel, data);
        else this.dispatch(channel, data);
        return this;
    }
    
    subscribe(channel: string, handle: Handler): PublishSubscribable {
        this.#medium.addEventListener(channel, handle, true);
        return this;
    }
    
    unsubscribe(channel: string, handle: Handler): PublishSubscribable {
        this.#medium.removeEventListener(channel, handle, true);
        return this;
    }
    
};
