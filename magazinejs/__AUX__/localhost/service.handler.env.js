
const { log } = console;
export class ServiceWorkerHandler {
    
    handle(e) {
        const { request } = e;
        const { url, method } = request;
        const { href, origin, port, host, hostname, pathname, search, searchParams, hash } = new URL(url);
        const segments = pathname.split('/').slice(1);  // trim empty entry
        const params = Object.fromEntries(searchParams);
        const actions = [
            href ,
            '*' ,
            origin ,
            host ,
            `${hostname}:*` ,
            `*:${port}` ,
            `[hostname]${hostname}` ,
            `${origin}${pathname}` ,
            `${host}${pathname}` ,
            `${hostname}:*${pathname}` ,
            `*:${port}${pathname}` ,
            pathname ,
            `/*` ,
            `${origin}/*` ,
            `${host}/*` ,
            `${hostname}:*/*` ,
            `*:${port}/*` ,
            search ,
            hash ,
        ];
        
        for (const action of actions) if (action in this) return this[action](request, e);
        if ('[...pathname]' in this) return this['[...pathname]'](request, e, segments);
        if ('{...search}' in this) return this['{...search}'](request, e, params, searchParams);
    }
    
};
