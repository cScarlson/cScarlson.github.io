
import { LIFECYCLE_EVENTS } from './events.js';
import { load } from './load.js';
import { V } from './core.js';

const { onverticesbootstrapinvoked } = LIFECYCLE_EVENTS;

function bootstrap(v, selector='module', parent=document) {
    var modules = parent.querySelectorAll(selector)  // ISSUE: this will also select elements that are nested somewhere within the same type of element as the selector!
      , modules = [ ...modules ]
      ;
    const details = load({ v, selector, parent, modules });
    
    V.publish(onverticesbootstrapinvoked, { parent, modules });
    
    return details;  // promise
}

export { bootstrap };
