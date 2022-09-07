
import V, {} from '/vertices/core.js';
import { Page } from '/app/subsystem/page.js';

const { log } = console;
V('cv', 'sandbox', function CVComponent($) {
    const uri = `./app/subsystem/cv/cv.component.html`;
    
    // export precepts
    Page.call(this, { name: 'cv', uri });
    
    return this;
});
