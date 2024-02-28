
import { SharedWorker as SharedWorkerIO } from '/developers/app/core/sharedworker.io.js';
import { Worker as WorkerIO } from '/developers/app/core/worker.io.js';
import { Wincomm } from '/developers/app/core/wincomm.js';
import { Broadcast } from '/developers/app/core/broadcast.js';

const { SharedWorker: NativeSharedWorker, Worker: NativeWorker } = window;
const { log } = console;
const options = { type: 'module' };
const Worker =   NativeSharedWorker ? NativeSharedWorker : NativeWorker;
const PubSub =   NativeSharedWorker ? SharedWorkerIO : WorkerIO;
const filename = NativeSharedWorker ? 'worker.shared' : 'worker';
const uri = `/developers/app/${filename}.js`;

log(`CONNECTED TO WORKER`, uri);

class Channels {
    static ['FRAME:HEIGHT:CHANGE'] = 'io://change/frame/height';
}

export const Sandbox = (class Sandbox extends Channels {
    static medium = new EventTarget();
    static worker = new PubSub({ worker: new Worker(uri, options) });
    static window = new Wincomm({ });
    static broadcast = new Broadcast({ });
    get medium() { return Sandbox.medium }
    get worker() { return Sandbox.worker }
    get window() { return Sandbox.window }
    get broadcast() { return Sandbox.broadcast }
    
    constructor(event) {
        super();
        const { target } = event;
        this.target = target;
    }
    
    static initialize() {
        const { worker, window, channel } = this;
        
        // |
        // | Provides throughput from worker -> medium
        // V
        worker.subscribe('SIDELOAD:REQUEST', this.#handleWorkerEvent);
        worker.subscribe('SIDELOAD:DISMISS', this.#handleWorkerEvent);
        worker.subscribe('ASCII:TILE:DESELECTION', this.#handleWorkerEvent);
        worker.subscribe('MENU:DISMISSED', this.#handleWorkerEvent);
        worker.subscribe('ASCII:SEARCH:QUERY', this.#handleWorkerEvent);
        
        return this;
    }
    
    static #handleWorkerEvent = (e) => {
        const { type, data } = e;
        const { [type]: handle } = this;
        
        if (handle) handle.call(this, type, data);
        else this.#dispatch(type, data);
    };
    
    static #dispatch(channel, data) {
        const event = new MessageEvent(channel, { data });
        this.medium.dispatchEvent(event);
        return this;
    }
    
    publish(channel, data) {
        if (channel in this) this[channel](channel, data);
        else this.worker.publish(channel, data);  // default to worker as medium
        return this;
    }
    
    subscribe(channel, handler) {
        this.medium.addEventListener(channel, handler, true);
        return this;
    }
    
    unsubscribe(channel, handler) {
        this.medium.removeEventListener(channel, handler, true);
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
    
    ['DEMO:BROADCAST:MESSAGE'](channel, data) {  // dispatch to broadcast
        this.broadcast.publish(channel, data);
    }
    
}).initialize();
