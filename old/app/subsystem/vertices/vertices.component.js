
import V, {} from '/vertices/core.js';

const { log } = console;
V('vertices', 'sandbox', function VerticesComponent($) {
    const thus = this;
    const readme = fetch('/vertices/README.md', { 'Content-Type': 'text/utf-8' }).then( r => r.text() );
    
    function handleReadme(readme) {
        const markup = marked.parse(readme);
        thus.readme = markup;
    }
    
    readme.then(handleReadme);
    
    // export precepts
    this.readme = '';
    this.use(`./app/subsystem/vertices/vertices.component.html`);
    
    return this;
});
