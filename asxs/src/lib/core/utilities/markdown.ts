
import { marked } from 'marked';

export const markdown = new (class MarkdownUtilities {
    
    parse(markdown: string): string {
        return marked.parse(markdown) as string;
    }
    
    secure(markdown: string): string {
        const html = this.parse(markdown);
        return this.escapeHTML(html);
    }
    
    escapeHTML(html: string): string {
        const element = document.createElement('textarea');
        element.textContent = html;
        return element.innerHTML;
    }
    
})();