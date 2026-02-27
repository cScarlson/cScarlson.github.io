
import { Command } from '@asxs/core/utilities/patterns/behavioral';

const { log } = console;

export const QUERY_HANDLER: `as:crawler:handler:${string}` = 'as:crawler:handler:default';
export class ElementCrawler extends Command {
    
    constructor(receiver: any, action: string = QUERY_HANDLER) {
        super(receiver, action);
    }
    
    execute = (element?: HTMLElement, ...more: HTMLElement[]) => {
        if (!element) return element;
        const { receiver, action } = this;
        const { [action]: handle } = receiver;
        const { dataset, children = [] } = element;
        const { [`[query]`]: value } = dataset;
        
        if (value) receiver[`as:query:${value}`] = element;
        if (handle) handle.call(receiver, element);
        this.execute(...more);
        this.execute(...children as HTMLElement[]);
    };
    
};
