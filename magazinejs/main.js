
import { environment } from '/env/env.js';
import '/asxs/v2.0.0/frameless/frameless.element.js';

const { type, worker } = environment;

if (worker) navigator.serviceWorker.register(worker, { type: 'module', scope: '/magazinejs/' });
