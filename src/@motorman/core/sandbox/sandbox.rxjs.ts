
import { ISubscriber } from '../subscriber.interface';
import { Reactive as Director, IDirectorOptions } from '../director';


class Sandbox {
    get utils() { return this.director.utils; }
    get channels() { return this.director.channels; }

    constructor(private director: Director) {
        return this;
    }

    in(channel: string) {
        return this.director.in(channel);
    }
    publish(channel: string, data?: any) {
        return this.director.publish(channel, data);
    }
    subscribe(channel: string, handler: () => {}) {
        return this.director.subscribe(channel, handler);
    }
    unsubscribe(channel: string, handler: () => {}) {
        return this.director.unsubscribe(channel, handler);
    }
    attach(observer: ISubscriber) {
        return this.director.attach(observer);
    }
    detach(observer: ISubscriber) {
        return this.director.detach(observer);
    }

}

export { Sandbox };
