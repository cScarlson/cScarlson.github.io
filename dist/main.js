
import V, { bootstrap } from './vertices/core.js';

const { log } = console;
const details = bootstrap(V).catch(katch);

function katch(error) {
    console.error(`Vertices: Uncaught Module-Load Error`, error);
    return error;
}
