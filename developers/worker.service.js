
const { log } = console;
const service = new (class ServiceWorker {
    VERSION = 'v1.0.0';
    CACHE_NAME = `CSC-Devs-${this.VERSION}`;
    resources = [
        '/font/Roboto/Roboto-Regular.ttf',
        '/lib/marked.min.js',
        '/lib/handlebars.min-v4.7.8.js',
        '/browserless/utilities/utilities.js',
        
        '/developers/manifest.json',
        '/developers/favicon.png',
        '/developers/screenshots/screenshot.page.home.png',
        '/developers/screenshots/screenshot.page.ascii.png',
        
        '/developers',
        '/developers/',
        '/developers/frameless.js',
        '/developers/main.js',
        '/developers/main.css',
        '/developers/reset.css',
        '/developers/global.css',
        '/developers/app/core.js',
        '/developers/app/core/utilities/ds/queue.js',
        '/developers/app/mediator.js',
        '/developers/app/worker.js',
        '/developers/app/worker.shared.js',
        '/developers/app/sandbox.js',
        '/developers/app/routes.js',
        '/developers/app/core/sharedworker.io.js',
        '/developers/app/core/worker.io.js',
        '/developers/app/core/wincomm.js',
        '/developers/app/core/broadcast.js',
        // PARTIALS
        '/developers/app/children/menu/menu.html',
        '/developers/app/children/menu/menu.css',
        '/developers/app/children/menu/menu.js',
        '/developers/app/children/router/router.html',
        '/developers/app/children/router/router.css',
        '/developers/app/children/router/router.js',
        '/developers/app/children/router/route.js',
        '/developers/app/children/footer/footer.html',
        '/developers/app/children/footer/footer.css',
        '/developers/app/children/footer/footer.js',
        '/developers/app/children/sideload/sideload.html',
        '/developers/app/children/sideload/sideload.css',
        '/developers/app/children/sideload/sideload.js',
        '/developers/app/children/pages/home/home.html?routed&',
        '/developers/app/children/pages/home/children/feature/feature.html?type=articles',
        '/developers/app/children/pages/home/children/feature/feature.html?type=tooling',
        '/developers/app/children/pages/home/children/feature/feature.html?type=more',
        '/developers/app/children/pages/home/children/feature/feature.css',
        '/developers/app/children/pages/home/children/feature/feature.js',
        '/developers/app/children/pages/articles/readme/readme.html?routed&name=developers&doc=.%2Fapp%2Fchildren%2Fpages%2Farticles%2Fdocs%2Fhow%2Fdevelopers.md',
        '/developers/app/children/pages/articles/readme/readme.html?routed&name=marketing&doc=.%2Fapp%2Fchildren%2Fpages%2Farticles%2Fdocs%2Fhow%2Fmarketing.md',
        '/developers/app/children/pages/articles/readme/readme.html?routed&name=employers&doc=.%2Fapp%2Fchildren%2Fpages%2Farticles%2Fdocs%2Fhow%2Femployers.md',
        '/developers/app/children/pages/articles/readme/readme.html?name=JavaScript+Broadcast+Channels&doc=.%2Fapp%2Fchildren%2Fpages%2Farticles%2Fdocs%2Fhow%2Fbroadcast.md',
        '/developers/app/children/pages/articles/broadcast/broadcast.html?routed&name=JavaScript+Broadcast+Channels&doc=.%2Fapp%2Fchildren%2Fpages%2Farticles%2Fdocs%2Fhow%2Fbroadcast.md',
        '/developers/app/children/pages/articles/broadcast/broadcast.css',
        '/developers/app/children/pages/articles/broadcast/broadcast.js',
        '/developers/app/children/pages/articles/readme/readme.css',
        '/developers/app/children/pages/articles/readme/readme.js',
        '/developers/app/children/pages/articles/docs/how/developers.md',
        '/developers/app/children/pages/articles/docs/how/marketing.md',
        '/developers/app/children/pages/articles/docs/how/employers.md',
        '/developers/app/children/pages/articles/docs/how/broadcast.md',
        '/developers/app/children/pages/ascii/ascii.html?routed&',
        '/developers/app/children/pages/ascii/ascii.css',
        '/developers/app/children/pages/ascii/children/searchbar/searchbar.html',
        '/developers/app/children/pages/ascii/children/searchbar/searchbar.css',
        '/developers/app/children/pages/ascii/children/searchbar/searchbar.js',
        '/developers/app/children/pages/ascii/children/view/view.html',
        '/developers/app/children/pages/ascii/children/view/view.css',
        '/developers/app/children/pages/ascii/children/view/view.js',
        '/developers/app/children/pages/ascii/children/view/characters.js',
        '/developers/app/children/pages/ascii/children/view/children/pager/pager.html',
        '/developers/app/children/pages/ascii/children/view/children/pager/pager.css',
        '/developers/app/children/pages/ascii/children/view/children/pager/pager.js',
    ];
    
    constructor() {
        self.addEventListener('install', this, true);
        self.addEventListener('activate', this, true);
        self.addEventListener('fetch', this, true);
    }
    
    install = async () => {
        const { CACHE_NAME, resources } = this;
        const cache = await caches.open(CACHE_NAME);
        const final = await resources.reduce( prefetch, Promise.resolve() );
        
        async function prefetch(previous, url) {
            await previous;
            const request = new Request(url);
            const response = await fetch(request);
            
            return cache.put(request, response);
        }
        
        return final;
    };
    
    activate = async () => {
        const { CACHE_NAME } = this;
        const names = await caches.keys();
        const keys = await Promise.all(names);
        const final = await keys.reduce( del, Promise.resolve() );
        
        async function del(previous, key) {
            if (key === CACHE_NAME) return Promise.resolve();  // skip matching cache name
            await previous;
            return caches.delete(key);  // delete older caches/versions
        }
        
        await clients.claim();
    };
    
    fetch = async (e) => {
        const { CACHE_NAME } = this;
        const { request } = e;
        const { url } = request;
        const cache = await caches.open(CACHE_NAME);
        const response = await cache.match(request)
            .then( response => response ? response : fetch(request) )
            .catch( e => new Response(null, { status: 404 }) )
            ;
        return response;
    };
    
    handleEvent(e) {
        if (e.type === 'install') return this.handleInstallation(e);
        if (e.type === 'activate') return this.handleActivation(e);
        if (e.type === 'fetch') return this.handleFetch(e);
    }
    
    handleInstallation(e) {
        e.waitUntil(this.install());
    }
    
    handleActivation(e) {
        e.waitUntil(this.activate());
    }
    
    handleFetch(e) {
        e.respondWith( this.fetch(e) );
    }
    
})();
