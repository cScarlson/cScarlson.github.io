
import type { ToDo } from '@asxs/core/types';
import type { Connectable } from './types';

const { log, warn, error: err } = console;
const DEFAULT_OPTIONS = {
    'characterData': true,
    'characterDataValue': true,
    'subtree': true,
    'childList': true,
    'attributes': true,
    'attributeOldValue': true,
    'attributeFilter': [],
};

export class Observer extends MutationObserver implements Connectable {
    
    constructor(protected handler: any = {}) {
        super( (mutations: MutationRecord[], observer: MutationObserver) => {
            for (const mutation of mutations) this.#callback(mutation, observer);
        } );
    }
    
    #callback(mutation: MutationRecord, observer: MutationObserver) {
        const { handler } = this;
        const { type } = mutation;
        const { [`mutation:${type}`]: handle } = handler;
        
        if (handle) handle.call(handler, mutation, observer);
    }
    
    connect(target: HTMLElement, options: MutationObserverInit = DEFAULT_OPTIONS) {
        this.observe(target, options);
    }
    
};
