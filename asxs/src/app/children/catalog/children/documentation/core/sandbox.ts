
import { markdown } from '@asxs/core/utilities';

export class Sandbox extends Object {
    
    constructor(data: any) {
        super(data);
        Object.assign(this, data);
    }
    
    escape(html: string): string {
        return  markdown.escapeHTML(html);
    }
    
};
