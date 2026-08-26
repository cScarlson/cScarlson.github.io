
import { environment } from '/env/env.js';
import '/asxs/v2.0.0/frameless/frameless.element.js';

const { type } = environment;
const { [type]: worker } = {
    'mck': undefined,
    'lcl': './service.worker.lcl.js',
    'dev': './service.worker.dev.js',
    'ssl': undefined,
    'stg': undefined,
    'prd': undefined,
};

if (worker) navigator.serviceWorker.register(worker, { scope: '/magazinejs/' });
