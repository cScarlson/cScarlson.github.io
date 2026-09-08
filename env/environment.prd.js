
import { Environment } from './env.model.js';
export const environment = new Environment({
    type: 'prd',
    origin: 'https://cscarlson.github.io',
    worker: '/magazinejs/service.worker.prd.js',
});
