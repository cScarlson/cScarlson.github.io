
import type { ToDo } from '@asxs/core/types';
import type { Connectable } from './types';

const DEFAULT_OPTIONS = {
    root: document.createElement('div'),
    rootMargin: '0px',
    scrollMargin: '0px',
    threshold: 1.0,
};

export class Observer extends IntersectionObserver implements Connectable {
    
    constructor(protected handler: any = {}, options: IntersectionObserverInit = DEFAULT_OPTIONS) {
        super( (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            for (const entry of entries) this.#callback(entry, observer);
        }, options );
    }
    
    #callback(entry: IntersectionObserverEntry, observer: IntersectionObserver) {
        const { handler } = this;
        const { target } = entry;
        const { dataset } = target as HTMLElement;
        const { ['(intersection)']: name } = dataset;
        const { [name as string]: handle } = handler as ToDo;
        
        if (handle) handle.call(handler, entry, observer);
    }
    
    connect(target: HTMLElement) {
        this.observe(target);
    }
    
};
