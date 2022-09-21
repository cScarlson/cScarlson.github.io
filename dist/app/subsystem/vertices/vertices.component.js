
import V, {} from '/dist/vertices/core.js';
import { Page } from '/dist/app/subsystem/page.js';

const { log } = console;
V('vertices', 'sandbox', function VerticesComponent($) {
    const uri = `./app/subsystem/vertices/vertices.component.html`;
    
    // export precepts
    Page.call(this, { name: 'vertices', uri });
    
    return this;
});
