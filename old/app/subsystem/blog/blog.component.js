
import V, {} from '/vertices/core.js';

const { log } = console;
V('blog', 'sandbox', function PageComponent($) {
    
    function update({ articles } = {}) {
        if (!articles) return;
        this.articles = articles;
    }
    
    // export precepts
    this.articles = [ ];
    this.call = update;
    this.attach(this);
    this.use(`./app/subsystem/blog/blog.component.html`);
    
    return this;
});
