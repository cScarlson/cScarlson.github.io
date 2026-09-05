
import { Environment } from './env.model.js';
export const environment = new Environment({
    type: 'lcl',
    origin: 'http://localhost:2999',
    worker: '/magazinejs/service.worker.lcl.js',
});

