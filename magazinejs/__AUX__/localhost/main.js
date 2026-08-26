
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
const root = new Route({
    type: 'href',
    uri: '*',
    children: [
        {
            type: 'origin',
            uri: 'http://localhost:3000',
            children: [
                {
                    type: 'pathname:segment',
                    uri: 'asxs',
                    children: [
                        {
                            type: 'pathname:segment',
                            uri: 'v2.0.0',
                            children: [
                                {
                                    type: 'pathname:segment',
                                    uri: 'core',
                                    children: [
                                        {
                                            type: 'pathname:segment',
                                            uri: 'utilities',
                                            children: [
                                                {
                                                    type: 'filename',
                                                    uri: 'markdown.js',
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'pathname:segment',
                    uri: '*',
                    children: [
                        {
                            type: 'pathname:segment',
                            uri: 'v2.0.0',
                            children: [
                                {
                                    type: 'pathname:segment',
                                    uri: 'core',
                                    children: [
                                        {
                                            type: 'pathname:segment',
                                            uri: 'utilities',
                                            children: [
                                                {
                                                    type: 'filename',
                                                    uri: 'markdown.js',
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
            ]
        },
        {
            type: 'origin',
            uri: '*',
        },
    ]
});

log(`@ROOT`, root);
root.attach(function observer(state) {
    log(`@observer`, this, state);
}, false).match('http://localhost:3000/asxs/v2.0.0/core/utilities/markdown.js?param1=test');

function handleServiceWorker(registration) {
    log(`@4000.registration`, registration);
    import('/asxs/v2.0.0/frameless/frameless.element.js');
}

log(`@@@@@@@@@@@@@@@@@@4000.main`, worker);
if (worker) navigator.serviceWorker.register(worker, { scope: '/' }).then(handleServiceWorker);
// import('/asxs/v2.0.0/frameless/frameless.element.js');
