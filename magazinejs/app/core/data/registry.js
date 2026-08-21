
import { environment } from '/env/env.js';
import * as lcl from './registry.lcl.js';
import * as dev from './registry.dev.js';
import * as prd from './registry.prd.js';

const { type } = environment;
export const { [type]: registry } = {
    'mck': dev,
    'lcl': lcl,
    'dev': dev,
    'ssl': dev,
    'stg': dev,
    'prd': prd,
};

console.log(`@ENVIRONMENT`, type, environment, registry);
