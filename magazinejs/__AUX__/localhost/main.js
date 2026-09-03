
import { environment } from '/env/env.js';

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

function handleServiceWorker(registration) {
    log(`@4000.registration`, registration);
    import('/asxs/v2.0.0/frameless/frameless.element.js');
}

log(`@@@@@@@@@@@@@@@@@@4000.main`, worker);
if (worker) navigator.serviceWorker.register(worker, { type: 'module', scope: '/' }).then(handleServiceWorker);
