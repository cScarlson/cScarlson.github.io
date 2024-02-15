
import { SharedWorker as SharedWorkerPubSub } from '/developers/app/core/sharedworker.pubsub.js';
import { Worker as WorkerPubSub } from '/developers/app/core/worker.pubsub.js';
import { Wincomm } from '/developers/app/core/wincomm.js';

const { SharedWorker: NativeSharedWorker, Worker: NativeWorker } = window;
const { log } = console;
const options = { type: 'module' };
const Worker =   NativeSharedWorker ? NativeSharedWorker : NativeWorker;
const PubSub =   NativeSharedWorker ? SharedWorkerPubSub : WorkerPubSub;
const filename = NativeSharedWorker ? 'worker.shared' : 'worker';
const uri = `/developers/app/${filename}.js`;

log(`CONNECTED TO WORKER`, uri);

class Channels {
    static ['FRAME:HEIGHT:CHANGE'] = 'io://change/frame/height';
}

export class Sandbox extends Channels {
    static worker = new PubSub({ worker: new Worker(uri, options) });
    static window = new Wincomm({ });
    get worker() { return Sandbox.worker }
    get window() { return Sandbox.window }
    
    constructor(event) {
        super();
        const { target } = event;
        this.target = target;
    }
    
    publish(channel, data) {
        this.worker.publish(channel, data);
        return this;
    }
    
    subscribe(channel, handler) {
        this.worker.subscribe(channel, handler);
        return this;
    }
    
    unsubscribe(channel, handler) {
        this.worker.unsubscribe(channel, handler);
        return this;
    }
    
    upstream(channel, data) {
        this.window.upstream(channel, data);
        return this;
    }
    
    downstream(channel, data) {
        this.window.downstream(channel, data);
        return this;
    }
    
    open(channel, handler) {
        this.window.subscribe(channel, handler);
        return this;
    }
    
    unopen(channel, handler) {
        this.window.unsubscribe(channel, handler);
        return this;
    }
    
    fire(type, detail) {
        const event = new CustomEvent(type, { detail });
        this.target.dispatchEvent(event);
        return this;
    }
    
    on(type, handler, bubble = true) {
        this.target.addEventListener(type, handler, bubble);
        return this;
    }
    
    off(type, handler, bubble = true) {
        this.target.removeEventListener(type, handler, bubble);
        return this;
    }
    
};
