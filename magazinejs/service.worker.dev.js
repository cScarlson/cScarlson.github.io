
import { ServiceWorkerHandler } from './service.handler.env.js';

const { log } = console;
const CLOUDFLARE_ORIGIN_LOCAL = 'http://localhost:4000';
const worker = new (class ServiceWorkerLocal extends ServiceWorkerHandler {
    
    constructor(self) {
        super();
        self.addEventListener('fetch', this, true);
    }
    
    #handleFetch(e) {
        this.handle(e);
    }
    
    handleEvent(e) {
        if (e.type === 'fetch') return this.#handleFetch(e);
    }
    
})(self);
