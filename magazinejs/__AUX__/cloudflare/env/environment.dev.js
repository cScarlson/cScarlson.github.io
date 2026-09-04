
import { default as manifest } from '/host.manifest.json' with { type: 'json' };
import { Environment } from './env.model.js';
export const environment = new Environment({
    type: 'dev',
    worker: './service.worker.dev.js',
    manifest,
});
