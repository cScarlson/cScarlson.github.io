
import { ISubscriber } from '../subscriber.interface';
import { Reactive as Director } from '../director';
import { ISandbox } from './sandbox.interface';


class Sandbox implements ISandbox {
    get utils() { return this.director.utils; }
    get channels() { return this.director.channels; }

    constructor(protected director: Director) {
        return this;
    }

    in(channel: string) {
        return this.director.in(channel);
    }
    publish(channel: string, data?: any, ...more: any[]) {
        this.director.publish(channel, data, ...more);
        return this;
    }
    subscribe(channel: string, handler: Function) {
        this.director.subscribe(channel, handler);
        return this;
    }
    unsubscribe(channel: string, handler: Function) {
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
