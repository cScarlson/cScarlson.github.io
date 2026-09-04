
import { default as manifest } from '/magazinejs/host.manifest.json' with { type: 'json' };
import { Environment } from './env.model.js';
export const environment = new Environment({
    type: 'dev',
    worker: '/magazinejs/service.worker.dev.js',
    manifest,
});
