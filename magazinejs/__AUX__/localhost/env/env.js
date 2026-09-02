
import { environment as mck } from './environment.mck.js';
import { environment as lcl } from './environment.lcl.js';
import { environment as dev } from './environment.dev.js';
import { environment as ssl } from './environment.ssl.js';
import { environment as stg } from './environment.stg.js';
import { environment as prd } from './environment.prd.js';

const { log } = console;
const { top } = window;
const { location } = top;
const { origin, searchParams } = new URL(location);
const env = searchParams.get('--env') || '';

export const { [`${origin}/${env}`]: environment } = {
    'http://localhost:4000/mck': mck,
    'http://localhost:4000/lcl': lcl,
    'http://localhost:4000/dev': dev,
    'http://localhost:4000/stg': stg,
    'http://localhost:4000/prd': prd,
    'http://localhost:3998/': mck,
    'http://localhost:3999/': lcl,
    'http://localhost:4000/': dev,
    'https://localhost:4000/': ssl,
    'http://localhost:4001/': stg,
    'https://magazinejs.otocarlson.workers.dev/': prd,
};

log(`@ENV`, origin, env, `${origin}/${env}`, environment);
