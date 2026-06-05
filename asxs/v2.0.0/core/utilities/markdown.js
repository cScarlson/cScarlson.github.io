
import './marked.js';

export const markdown = new (class MarkdownUtilities {
    
    parse(markdown) {
        return marked.parse(markdown);
    }
    
    secure(markdown) {
        const html = this.parse(markdown);
        return this.escapeHTML(html);
    }
    
    escapeHTML(html) {
        const element = document.createElement('textarea');
        element.textContent = html;
        return element.innerHTML;
    }
    
})();