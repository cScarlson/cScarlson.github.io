
const { log } = console;
export class ServiceWorkerHandler {
    
    handle(e) {
        const { request } = e;
        const { url, method } = request;
        const { href, origin, port, host, hostname, pathname, search, searchParams, hash } = new URL(url);
        const segments = pathname.split('/').slice(1);  // trim empty entry
        const params = Object.fromEntries(searchParams);
        
        if (href in this) return this[href](request, e);
        if ('*' in this) return this['*'](request, e);
        if (origin in this) return this[origin](request, e);
        if (host in this) return this[host](request, e);
        if (`${hostname}:*` in this) return this[`${hostname}:*`](request, e);
        if (`*:${port}` in this) return this[`*:${port}`](request, e);
        if (`[hostname]${hostname}` in this) return this[`[hostname]${hostname}`](request, e);
        if (`${origin}${pathname}` in this) return this[`${origin}${pathname}`](request, e);
        if (`${host}${pathname}` in this) return this[`${host}${pathname}`](request, e);
        if (`${hostname}:*${pathname}` in this) return this[`${hostname}:*${pathname}`](request, e);
        if (`*:${port}${pathname}` in this) return this[`*:${port}${pathname}`](request, e);
        if (pathname in this) return this[pathname](request, e);
        if (`/*` in this) return this[`/*`](request, e);
        if (`${origin}/*` in this) return this[`${origin}/*`](request, e);
        if (`${host}/*` in this) return this[`${host}/*`](request, e);
        if (`${hostname}:*/*` in this) return this[`${hostname}:*/*`](request, e);
        if (`*:${port}/*` in this) return this[`*:${port}/*`](request, e);
        if ('[...pathname]' in this) return this['[...pathname]'](request, e, segments);
        if (search in this) return this[search](request, e);
        if ('{...search}' in this) return this['{...search}'](request, e, params, searchParams);
        if (hash in this) return this[hash](request, e);  // don't worry about hash too much
    }
    
    // ['http://localhost:3000/asxs/v2.0.0/core/utilities/markdown.js?param1=test#/some/path']({ url }, e) {
    //     log(`@href`, url);
    // }
    
    // ['*']({ url }, e) {
    //     log(`@*`, url);
    // }
    
    // ['http://localhost:3000']({ url }, e) {
    //     log(`@origin`, url);
    // }
    
    // ['localhost:3000']({ url }, e) {
    //     log(`@host`, url);
    // }
    
    // ['localhost:*']({ url }, e) {
    //     log(`@hostname:*`, url);
    // }
    
    // ['*:3000']({ url }, e) {
    //     log(`@*:port`, url);
    // }
    
    // ['[hostname]localhost']({ url }, e) {
    //     log(`@hostname`, url);
    // }
    
    // ['http://localhost:3000/asxs/v2.0.0/core/utilities/markdown.js']({ url }, e) {
    //     log(`@pathname-001`, url);
    // }
    
    // ['localhost:3000/asxs/v2.0.0/core/utilities/markdown.js']({ url }, e) {
    //     log(`@pathname-002`, url);
    // }
    
    // ['localhost:*/asxs/v2.0.0/core/utilities/markdown.js']({ url }, e) {
    //     log(`@pathname-003`, url);
    // }
    
    // ['*:3000/asxs/v2.0.0/core/utilities/markdown.js']({ url }, e) {
    //     log(`@pathname-004`, url);
    // }
    
    // ['/asxs/v2.0.0/core/utilities/markdown.js']({ url }, e) {
    //     log(`@pathname-005`, url);
    // }
    
    // ['/*']({ url }, e) {
    //     log(`@pathname-006`, url);
    // }
    
    // ['http://localhost:3000/*']({ url }, e) {
    //     log(`@pathname-007`, url);
    // }
    
    // ['localhost:3000/*']({ url }, e) {
    //     log(`@pathname-008`, url);
    // }
    
    // ['localhost:*/*']({ url }, e) {
    //     log(`@pathname-009`, url);
    // }
    
    // ['*:3000/*']({ url }, e) {
    //     log(`@pathname-010`, url);
    // }
    
    // ['[...pathname]']({ url }, e, pathnames) {
    //     log(`@[...pathname]`, pathnames);
    // }
    
    // ['?param1=test']({ url }, e) {
    //     log(`@search`, url);
    // }
    
    // ['{...search}']({ url }, e, params, searchParams) {
    //     log(`@[...search]`, params, searchParams);
    // }
    
    // ['#/some/path']({ url }, e) {
    //     log(`@hash`, url);
    // }
    
};
