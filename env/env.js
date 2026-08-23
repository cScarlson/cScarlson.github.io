
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

log(`@ENV`, origin, env, `${origin}/${env}`);

export const { [`${origin}/${env}`]: environment } = {
    'http://localhost:3000/mck': mck,
    'http://localhost:3000/lcl': lcl,
    'http://localhost:3000/dev': dev,
    'http://localhost:3000/stg': stg,
    'http://localhost:3000/prd': prd,
    'http://localhost:2998/': mck,
    'http://localhost:2999/': lcl,
    'http://localhost:3000/': dev,
    'https://localhost:3000/': ssl,
    'http://localhost:3001/': stg,
    'https://cscarlson.github.io/': prd,
};
