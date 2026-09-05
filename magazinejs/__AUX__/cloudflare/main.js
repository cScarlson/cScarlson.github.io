
import { environment } from '/env/env.js';

const { log } = console;
const { type, worker } = environment;

function handleServiceWorker(registration) {
    log(`@handleServiceWorker`, registration);
    import(`/asxs/v2.0.0/frameless/frameless.element.js`);
}

if (worker) navigator.serviceWorker.register(worker, { type: 'module', scope: '/' }).then(handleServiceWorker);
