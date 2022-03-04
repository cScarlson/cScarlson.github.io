
import { load } from './vertices';

const $modules = document.querySelectorAll('module')
    , modules = [ ...$modules ]
    ;
const details = load(...modules).catch(katch);

function katch(error: Error) {
    console.error(`Vertices: Uncaught Module-Load Error`, error);
    return error;
}

details.then( details => console.log('detailsz', details) );
