
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

export class Observer extends MutationObserver {
    handler = {};
    
    constructor(handler = {}) {
        super( (mutations, observer) => {
            for (const mutation of mutations) this.#callback(mutation, observer);
        } );
    }
    
    #callback(mutation, observer) {
        const { handler } = this;
        const { type } = mutation;
        const { [`mutation:${type}`]: handle } = handler;
        
        if (handle) handle.call(handler, mutation, observer);
    }
    
    connect(target, options = DEFAULT_OPTIONS) {
        this.observe(target, options);
    }
    
};
