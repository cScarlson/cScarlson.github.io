
import { environment } from '/env/env.js';
// import '/asxs/v2.0.0/frameless/frameless.element.js';
import { Route } from './router.js';

const { log } = console;
const { type } = environment;
const { [type]: worker } = {
    'mck': undefined,
    'lcl': './service.worker.lcl.js',
    'dev': './service.worker.dev.js',
    'ssl': undefined,
    'stg': undefined,
    'prd': undefined,
};
const service = new (class ServiceWorkerHandler {
    
    #pathnames(url) {
        const { href, origin, port, host, hostname, pathname, search, searchParams, hash } = url;
        const segments = pathname.split('/');
        const trimmed = segments.slice(1);  // eliminate empty space; e.g: '/'.split === [ '', '' ]
        const refined = trimmed.reduce(refine, trimmed);
        const grouped = Object.groupBy( refined, (s, i) =>  Math.floor(i / trimmed.length) );
        const chunked = Object.values(grouped);
        
        function refine(segments, segment, i, array) {
            const additional0 = segments.slice(segments.length - array.length);
            const additional1 = segments.slice(segments.length - array.length);
            
            additional0[i] = '*';
            additional1[array.length - 1 - i] = '*';
            // log(`@refine`, segments.length - i, segments);
            
            return [ ...segments, ...additional0, ...additional1 ];
        }
        
        log(`@pathnames()`, refined, grouped, chunked);
        return [];
    }
    
    handle(e) {
        const { request } = e;
        const { url, method } = request;
        const { href, origin, port, host, hostname, pathname, search, searchParams, hash } = new URL(url);
        const location = new URL(url);
        const pathnames = this.#pathnames(location);
        
        log(`@handle`, request, new URL(url));
        if (href in this) return this[href](request, e);
        if ('*' in this) return this[href](request, e);
        
        if (origin in this) return this[href](request, e);
        
        if (host in this) return this[href](request, e);
        
        if (hostname in this) return this[href](request, e);
        if (`${host}:*` in this) return this[href](request, e);
        if (`*:${port}` in this) return this[href](request, e);
        
        if (`${origin}${pathname}` in this) return this[href](request, e);
        if (`${host}${pathname}` in this) return this[href](request, e);
        if (`${hostname}${pathname}` in this) return this[href](request, e);
        if (`${host}:*${pathname}` in this) return this[href](request, e);
        if (`*:${port}${pathname}` in this) return this[href](request, e);
        if (pathname in this) return this[href](request, e);
        if (`/*` in this) return this[href](request, e);
        if (`${origin}/*` in this) return this[href](request, e);
        if (`${host}/*` in this) return this[href](request, e);
        if (`${hostname}/*` in this) return this[href](request, e);
        if (`${host}:*/*` in this) return this[href](request, e);
        if (`*:${port}/*` in this) return this[href](request, e);
        for (const pathname in pathnames) if (pathname in this) return log(`@PATHNAMES`, pathname);
        
        if (`${origin}${search}` in this) return this[href](request, e);
        if (`${host}${search}` in this) return this[href](request, e);
        if (`${hostname}${search}` in this) return this[href](request, e);
        if (`${host}:*${search}` in this) return this[href](request, e);
        if (`*:${port}${search}` in this) return this[href](request, e);
        if (`${origin}${pathname}${search}` in this) return this[href](request, e);
        if (`${host}${pathname}${search}` in this) return this[href](request, e);
        if (`${hostname}${pathname}${search}` in this) return this[href](request, e);
        if (`${host}:*${pathname}${search}` in this) return this[href](request, e);
        if (`*:${port}${pathname}${search}` in this) return this[href](request, e);
        if (search in this) return this[href](request, e);
        // more dynamic
        
        if (hash in this) return this[href](request, e);  // don't worry about hash too much
        
        // if (XXXXXXXX in this) return this[href](request, e);
    }
    
})();

service.handle({
    request: new Request('http://localhost:3000/asxs/v2.0.0/core/utilities/markdown.js?param1=test#/some/path', { method: 'GET' }),
});

service.handle({
    request: new Request('http://magazinejs.otocarlson.workers.dev/asxs/v2.0.0/core/utilities/markdown.js?param1=test#/some/path', { method: 'GET' }),
});

function handleServiceWorker(registration) {
    log(`@4000.registration`, registration);
    import('/asxs/v2.0.0/frameless/frameless.element.js');
}

log(`@@@@@@@@@@@@@@@@@@4000.main`, worker);
if (worker) navigator.serviceWorker.register(worker, { scope: '/' }).then(handleServiceWorker);
// import('/asxs/v2.0.0/frameless/frameless.element.js');
