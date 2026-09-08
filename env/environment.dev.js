
import { Environment } from './env.model.js';
export const environment = new Environment({
    type: 'dev',
    origin: 'http://localhost:3000',
    worker: '/magazinejs/service.worker.dev.js',
});
