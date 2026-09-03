
import { ServiceWorkerHandler } from './service.handler.env.js';

const { log } = console;
const CLOUDFLARE_ORIGIN_LOCAL = 'http://localhost:4000';
const worker = new (class ServiceWorkerLocal extends ServiceWorkerHandler {
    
    constructor(self) {
        super();
        self.addEventListener('fetch', this, true);
    }
    
    ['http://localhost:4000/asxs/v2.0.0/button/button.rmd.html'](request, e) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, 'http://localhost:3000');
        
        log(`@CAUGHT:3000!!!!!!!!!!!`, request, sub);
        e.respondWith( fetch(sub) );
    }
    
    #handleFetch(e) {
        // log(`@3000?whoDoneIt`, e.request);
        this.handle(e);
    }
    
    handleEvent(e) {
        if (e.type === 'fetch') return this.#handleFetch(e);
    }
    
})(self);
