
import V, {} from '/vertices/core.js';
import { Page } from '/app/subsystem/page.js';

const { log } = console;
V('about', 'sandbox', function AboutComponent($) {
    const uri = `./app/subsystem/about/about.component.html`;
    
    // export precepts
    Page.call(this, { name: 'about', uri });
    
    return this;
});
