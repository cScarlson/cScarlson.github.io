
import V, {} from '/vertices/core.js';
import { Sandbox } from './core/sandbox.js';

V('child:now', Sandbox, function ChildNow($) {
    
    this.innerHTML = '...child:now';
    // $.log(`@child:now`, this, $);
    
    return this;
});
