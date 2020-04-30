
import { ISubscriber } from '../subscriber.interface';
import { Reactive as Director } from '../director';
import { ISandbox } from './sandbox.interface';


class Sandbox implements ISandbox {
    get utils() { return this.director.utils; }
    get channels() { return this.director.channels; }

    constructor(protected director: Director) {
        return this;
    }
    
    protected get(channel: string): string {
        if ( !(channel in this.channels) ) console.warn(`Warning! channel "${channel}" does not exist in channels.`);
        var channel: string = this.channels[channel] || channel;
        return channel;
    }

    in(channel: string) {
        var channel: string = this.get(channel);
        return this.director.in(channel);
    }
    publish(channel: string, data?: any, ...more: any[]) {
        var channel: string = this.get(channel);
        this.director.publish(channel, data, ...more);
        return this;
    }
    subscribe(channel: string, handler: Function) {
        var channel: string = this.get(channel);
        this.director.subscribe(channel, handler);
        return this;
    }
    unsubscribe(channel: string, handler: Function) {
        var channel: string = this.get(channel);
        this.director.unsubscribe(channel, handler);
        return this;
    }
    attach(observer: ISubscriber) {
        this.director.attach(observer);
        return this;
    }
    detach(observer: ISubscriber) {
        this.director.detach(observer);
        return this;
    }

}

export { Sandbox };
