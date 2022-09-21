
import V, {} from '/vertices/core.js';

const { log } = console;
V('cv', 'sandbox', function CVComponent($) {
    const uri = `./app/subsystem/cv/cv.component.html`;
    
    // export precepts
    this.use(uri);
    
    return this;
});
