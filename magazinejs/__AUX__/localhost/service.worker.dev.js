
import { ServiceWorkerHandler } from './service.handler.env.js';
import { default as manifest } from './host.manifest.dev.json' with { type: 'json' };

const { log } = console;
const { host, source } = manifest;
const { host: HOST } = source;
const worker = new (class ServiceWorkerLocal extends ServiceWorkerHandler {
    
    constructor(self) {
        super();
        self.addEventListener('activate', this, true);
        self.addEventListener('fetch', this, true);
    }
    
    ['[...pathname]'](request, e, [ root, ...more ]) {
        if (root === 'asxs') return this['[...pathname]/asxs/*'](request, e, [ root, ...more ]);
        if (root === 'env') return this['[...pathname]/env/*'](request, e, [ root, ...more ]);
    }
    
    ['[...pathname]/asxs/*'](request, e, [ asxs, version, domain ]) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, HOST);
        
        // log(`@CAUGHT:4000`, request.url, sub);
        e.respondWith( fetch(sub) );
    }
    
    ['[...pathname]/env/*'](request, e, [ root ]) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, 'http://localhost:4000');
        
        // log(`@CAUGHT:4000`, request, sub);
        e.respondWith( fetch(sub) );
    }
    
    ['?platform=magazinejs&type=asset'](request, e) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, HOST);
        
        log(`@CAUGHT:4000?WTF`, request, sub);
        e.respondWith( fetch(sub) );
    }
    
    ['http://localhost:4000/app/children/menu/sidebar/sidebar.rmd.html'](request, e) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, 'http://localhost:3000/magazinejs');
        
        log(`@CAUGHT:4000`, request, sub);
        e.respondWith( fetch(sub) );
    }
    
    ['http://localhost:4000/app/children/menu/main/main.rmd.html'](request, e) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, 'http://localhost:3000/magazinejs');
        
        log(`@CAUGHT:4000`, request, sub);
        e.respondWith( fetch(sub) );
    }
    
    ['http://localhost:4000/app/core/router/router.rmd.html'](request, e) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, 'http://localhost:3000/magazinejs');
        
        log(`@CAUGHT:4000`, request, sub);
        e.respondWith( fetch(sub) );
    }
    
    ['http://localhost:4000/app/children/footer/footer.rmd.html'](request, e) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, 'http://localhost:3000/magazinejs');
        
        log(`@CAUGHT:4000`, request, sub);
        e.respondWith( fetch(sub) );
    }
    
    ['http://localhost:4000/app/children/menu/action.rmd.html'](request, e) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, 'http://localhost:3000/magazinejs');
        
        log(`@CAUGHT:4000`, request, sub);
        e.respondWith( fetch(sub) );
    }
    
    ['http://localhost:4000/app/children/404/404.rmd.html'](request, e) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, 'http://localhost:3000/magazinejs');
        
        log(`@CAUGHT:4000`, request, sub);
        e.respondWith( fetch(sub) );
    }
    
    ['http://localhost:4000/app/children/404/image.gif'](request, e) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, 'http://localhost:3000/magazinejs');
        
        log(`@CAUGHT:4000`, request, sub);
        e.respondWith( fetch(sub) );
    }
    
    ['http://localhost:4000/magazinejs/app/core/data/data.js'](request, e) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, HOST);
        
        log(`@CAUGHT:4000`, request, sub);
        e.respondWith( fetch(sub) );
    }
    
    ['http://localhost:4000/magazinejs/app/children/menu/sidebar/sidebar.rmd.html'](request, e) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, 'http://localhost:3000/magazinejs');
        
        log(`@CAUGHT:4000`, request, sub);
        e.respondWith( fetch(sub) );
    }
    
    ['http://localhost:4000/magazinejs/app/children/menu/main/main.rmd.html'](request, e) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, 'http://localhost:3000/magazinejs');
        
        log(`@CAUGHT:4000`, request, sub);
        e.respondWith( fetch(sub) );
    }
    
    ['http://localhost:4000/magazinejs/app/children/footer/footer.rmd.html'](request, e) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, 'http://localhost:3000/magazinejs');
        
        log(`@CAUGHT:4000`, request, sub);
        e.respondWith( fetch(sub) );
    }
    
    #handleFetch(e) {
        // log(`@4000?whoDoneIt`, e.request);
        this.handle(e);
    }
    
    #handleActivation(e) {
        log(`@activation:4000`, e);
        e.waitUntil( self.clients.claim() );
    }
    
    handleEvent(e) {
        if (e.type === 'activate') return this.#handleActivation(e);
        if (e.type === 'fetch') return this.#handleFetch(e);
    }
    
})(self);
