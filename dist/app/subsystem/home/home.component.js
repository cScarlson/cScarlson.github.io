
import V, {} from '/vertices/core.js';
import { Page } from '/app/subsystem/page.js';

const { log } = console;
V('home', 'sandbox', function HomeComponent($) {
    const uri = `./app/subsystem/home/home.component.html`;
    
    // export precepts
    Page.call(this, { name: 'home', uri });
    
    return this;
});
