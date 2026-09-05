
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
    
    ['?platform=magazinejs&type=asset&host=cscarlson.github.io'](request, e) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, HOST);
        
        e.respondWith( fetch(sub) );
    }
    
    ['?platform=magazinejs&type=asset&target=article'](request, e) {
        const { url } = request;
        const { origin, hash } = new URL(url);
        const host = hash.substring(1);
        const sub = url.replace(origin, host);
        
        e.respondWith( fetch(sub) );
    }
    
    ['[...pathname]'](request, e, [ root, ...more ]) {
        if (root === 'asxs') return this['[...pathname]/asxs/*'](request, e, [ root, ...more ]);
        if (root === 'env') return this['[...pathname]/env/*'](request, e, [ root, ...more ]);
    }
    
    ['[...pathname]/asxs/*'](request, e, [ asxs, version, domain ]) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, HOST);
        
        e.respondWith( fetch(sub) );
    }
    
    ['[...pathname]/env/*'](request, e, [ root ]) {
        const { url } = request;
        const { origin } = new URL(url);
        const sub = url.replace(origin, location.origin);
        
        e.respondWith( fetch(sub) );
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
