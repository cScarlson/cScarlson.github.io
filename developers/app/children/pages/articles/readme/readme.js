
import { $ } from '/developers/app/core.js';
import { default as utilities } from '/browserless/utilities/utilities.js';

const { console, fetch, marked } = window;
const { log } = console;

$.set('readme', class {
    name = '--NO-NAME--';
    doc = '--UNDEFINED-DOC-URL--';
    content = document.createElement('div');
    
    constructor($) {
        const { target } = $;
        const content = target.querySelector('.article.content');
        
        this.$ = $;
        this.content = content;
        target.addEventListener('router:data', this, true);
    }
    
    handleEvent(e) {
        if (e.type === 'router:data') return this.handleRouterData(e);
    }
    
    async handleRouterData(e) {
        const {  content } = this;
        const { detail } = e;
        const { name, doc: url } = { ...this, ...detail };
        const { innerHTML: template } = content;
        const response = await fetch(url);
        const markdown = await response.text();
        const html = marked.parse(markdown);
        const readme = utilities.interpolate(html)({ name });
        const innerHTML = utilities.interpolate(template)({ name, readme });
        
        content.innerHTML = innerHTML;
    }
    
});
