
import { ServiceWorkerHandler } from './service.handler.env.js';

const CLOUDFLARE_ORIGIN_LOCAL = 'http://localhost:4000';
const worker = new (class ServiceWorkerLocal extends ServiceWorkerHandler {
    
    constructor(self) {
        super();
        self.addEventListener('activate', this, true);
        self.addEventListener('fetch', this, true);
    }
    
    ['https://magazinejs.otocarlson.workers.dev'](request, e) {
        const { url } = request;
        const { origin } = new URL(url);
        const redirect = url.replace(origin, CLOUDFLARE_ORIGIN_LOCAL);
        const response = fetch(redirect);
        
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
