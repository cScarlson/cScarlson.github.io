
import { ServiceWorkerHandler } from './service.handler.env.js';

const { log } = console;
const CLOUDFLARE_ORIGIN_LOCAL = 'http://localhost:4000';
const worker = new (class ServiceWorkerLocal extends ServiceWorkerHandler {
    
    constructor(self) {
        super();
        self.addEventListener('fetch', this, true);
    }
    
    ['/asxs/v2.0.0/frameless/frameless.element.js'](e) {
        const { request } = e;
        const { url } = request;
        const { origin } = new URL(url);
        const redirect = url.replace(origin, 'http://localhost:3000');
        log(`@#@#@#@#@#@#@#@#@#@#`, redirect);
        const response = fetch(redirect);
        
        e.respondWith(response);
    }
    
    ['[...pathname]'](request, e, [ root, ...more ]) {
        if (root === 'asxs') return this['[...pathname]/asxs/*'](request, e, [ root, ...more ]);
        if (root === 'env') return this['[...pathname]/env/*'](request, e, [ root, ...more ]);
    }
    
    ['[...pathname]/asxs/*'](request, e, [ asxs, version, domain ]) {
        log(`@...*`, asxs, version, domain);
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, 'http://localhost:3000');
        
        log(`@CAUGHT:4000`, request, sub);
        e.respondWith( fetch(sub) );
    }
    
    ['[...pathname]/env/*'](request, e, [ root ]) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, 'http://localhost:4000');
        
        // log(`@CAUGHT:4000`, request, sub);
        e.respondWith( fetch(sub) );
    }
    
    ['http://localhost:4000/magazinejs/app/core/data/data.js'](request, e) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, 'http://localhost:3000');
        
        // log(`@CAUGHT:4000`, request, sub);
        e.respondWith( fetch(sub) );
    }
    
    ['http://localhost:4000/app/children/menu/sidebar/sidebar.rmd.html'](request, e) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, 'http://localhost:3000/magazinejs');
        
        // log(`@CAUGHT:4000`, request, sub);
        e.respondWith( fetch(sub) );
    }
    
    ['http://localhost:4000/app/children/menu/main/main.rmd.html'](request, e) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, 'http://localhost:3000/magazinejs');
        
        // log(`@CAUGHT:4000`, request, sub);
        e.respondWith( fetch(sub) );
    }
    
    ['http://localhost:4000/app/core/router/router.rmd.html'](request, e) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, 'http://localhost:3000/magazinejs');
        
        // log(`@CAUGHT:4000`, request, sub);
        e.respondWith( fetch(sub) );
    }
    
    ['http://localhost:4000/app/children/footer/footer.rmd.html'](request, e) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, 'http://localhost:3000/magazinejs');
        
        // log(`@CAUGHT:4000`, request, sub);
        e.respondWith( fetch(sub) );
    }
    
    ['http://localhost:4000/app/children/menu/action.rmd.html'](request, e) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, 'http://localhost:3000/magazinejs');
        
        // log(`@CAUGHT:4000`, request, sub);
        e.respondWith( fetch(sub) );
    }
    
    ['http://localhost:4000/app/children/404/404.rmd.html'](request, e) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, 'http://localhost:3000/magazinejs');
        
        // log(`@CAUGHT:4000`, request, sub);
        e.respondWith( fetch(sub) );
    }
    
    ['http://localhost:4000/app/children/404/image.gif'](request, e) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, 'http://localhost:3000/magazinejs');
        
        // log(`@CAUGHT:4000`, request, sub);
        e.respondWith( fetch(sub) );
    }
    
    #handleFetch(e) {
        // log(`@4000?whoDoneIt`, e.request);
        this.handle(e);
    }
    
    // ['[...pathname]'](request, e, pathnames) {
    //     const { url } = request;
    //     const { origin } = new URL(url);
    //     const sub = url.replace(origin, 'http://localhost:3000');
        
    //     log(`@CAUGHT`, sub, request, pathnames);
    //     e.respondWith( fetch(sub) );
    // }
    
    // ['/asxs/v2.0.0/core/element/element.js'](request, e) {
    //     const { url } = request;
    //     const { origin } = new URL(url);
    //     log(`@CAUGHT`, request);
    //     e.respondWith( fetch( url.replace(origin, 'http://localhost:3000') ) );
    // }
    
    // ['GET:https://magazinejs.otocarlson.workers.dev'](e) {
    //     const { request } = e;
    //     const { url } = request;
    //     const { origin } = new URL(url);
    //     const redirect = url.replace(origin, CLOUDFLARE_ORIGIN_LOCAL);
    //     const response = fetch(redirect);
        
    //     e.respondWith(response);
    // }
    
    // ['GET:http://localhost:3000/app/app.rmd.html'](e) {
    //     console.log(`@GET:http://localhost:3000/app/app.rmd.html`, e.request.url);
    //     // const { request } = e;
    //     // const { url } = request;
    //     // const { origin } = new URL(url);
    //     // const redirect = url.replace(origin, 'http://localhost:3000');
    //     // const response = fetch(redirect);
        
    //     // e.respondWith(response);
    // }
    
    // ['GET:http://localhost:4000/asxs/v2.0.0/frameless/frameless.element.js'](e) {
    //     const { request } = e;
    //     const { url } = request;
    //     const { origin } = new URL(url);
    //     const redirect = url.replace(origin, 'http://localhost:3000');
    //     const response = fetch(redirect);
        
    //     e.respondWith(response);
    // }
    
    // ['GET:http://localhost:4000/asxs/v2.0.0/core/element/element.js'](e) {
    //     const { request } = e;
    //     const { url } = request;
    //     const { origin } = new URL(url);
    //     const redirect = url.replace(origin, 'http://localhost:3000');
    //     const response = fetch(redirect);
        
    //     e.respondWith(response);
    // }
    
    handleEvent(e) {
        if (e.type === 'fetch') return this.#handleFetch(e);
    }
    
})(self);
