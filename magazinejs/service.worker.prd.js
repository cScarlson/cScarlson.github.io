
import { ServiceWorkerHandler } from './service.handler.env.js';

const CLOUDFLARE_ORIGIN_LOCAL = 'http://localhost:4000';
const worker = new (class ServiceWorkerLocal extends ServiceWorkerHandler {
    
    constructor(self) {
        super();
        self.addEventListener('activate', this, true);
        self.addEventListener('fetch', this, true);
    }
    
    ['http://localhost:4000/magazinejs/index.lcl.json'](request, e) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const response = new Response('{ "publisher": "noop", "host": "noop", "articles": [] }', { status: 200, headers });
        log(`@WORKER`, request, response);
        e.respondWith(response);
    }
    
    #handleFetch(e) {
        this.handle(e);
    }
    
    #handleActivation(e) {
        e.waitUntil( self.clients.claim() );
    }
    
    handleEvent(e) {
        if (e.type === 'activate') return this.#handleActivation(e);
        if (e.type === 'fetch') return this.#handleFetch(e);
    }
    
})(self);
