
const CLOUDFLARE_ORIGIN_LOCAL = 'http://localhost:4000';
const worker = new (class ServiceWorkerLocal {
    
    constructor(self) {
        self.addEventListener('fetch', this, true);
    }
    
    #handleFetch(e) {
        const { request } = e;
        const { url, method } = request;
        const { href, origin, pathname } = new URL(url);
        const { [`${method}:${href}`]: handleHREF, [`${method}:${origin}`]: handleOrigin, [`${method}:${pathname}`]: handlePathname } = this;
        
        
        // console.log(`@ServiceWorker4000.dev`, href);
        if (handleHREF) handleHREF.call(this, e);
        if (handleOrigin) handleOrigin.call(this, e);
        if (handlePathname) handlePathname.call(this, e);
    }
    
    ['GET:https://magazinejs.otocarlson.workers.dev'](e) {
        const { request } = e;
        const { url } = request;
        const { origin } = new URL(url);
        const redirect = url.replace(origin, CLOUDFLARE_ORIGIN_LOCAL);
        const response = fetch(redirect);
        
        e.respondWith(response);
    }
    
    ['GET:http://localhost:3000/app/app.rmd.html'](e) {
        console.log(`@GET:http://localhost:3000/app/app.rmd.html`, e.request.url);
        // const { request } = e;
        // const { url } = request;
        // const { origin } = new URL(url);
        // const redirect = url.replace(origin, 'http://localhost:3000');
        // const response = fetch(redirect);
        
        // e.respondWith(response);
    }
    
    ['GET:http://localhost:4000/asxs/v2.0.0/frameless/frameless.element.js'](e) {
        const { request } = e;
        const { url } = request;
        const { origin } = new URL(url);
        const redirect = url.replace(origin, 'http://localhost:3000');
        const response = fetch(redirect);
        
        e.respondWith(response);
    }
    
    ['GET:http://localhost:4000/asxs/v2.0.0/core/element/element.js'](e) {
        const { request } = e;
        const { url } = request;
        const { origin } = new URL(url);
        const redirect = url.replace(origin, 'http://localhost:3000');
        const response = fetch(redirect);
        
        e.respondWith(response);
    }
    
    handleEvent(e) {
        if (e.type === 'fetch') return this.#handleFetch(e);
    }
    
})(self);
