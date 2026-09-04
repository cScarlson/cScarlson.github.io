
import { environment } from '/env/env.js';

const { log } = console;
const { type, worker } = environment;

function handleServiceWorker(registration) {
    log(`@4000.registration`, registration);
    import(`/asxs/v2.0.0/frameless/frameless.element.js`);
}

log(`@4000.main`, type, environment, worker);
if (worker) navigator.serviceWorker.register(worker, { type: 'module', scope: '/' }).then(handleServiceWorker);
