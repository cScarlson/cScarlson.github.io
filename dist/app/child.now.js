
import V, {} from '/vertices/core.js';

V('child:now', 'sandbox', function ChildNow($) {
    
    this.innerHTML = '...child:now';
    // $.log(`@child:now`, this, $);
    
    return this;
});
