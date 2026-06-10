
const DEFAULT_OPTIONS = {
    root: document.createElement('div'),
    rootMargin: '0px',
    scrollMargin: '0px',
    threshold: 1.0,
};

export class Observer extends IntersectionObserver {
    handler = {};
    
    constructor(handler = {}, options = DEFAULT_OPTIONS) {
        super( (entries, observer) => {
            for (const entry of entries) this.#callback(entry, observer);
        }, options );
    }
    
    #callback(entry, observer) {
        const { handler } = this;
        const { target } = entry;
        const { dataset } = target;
        const { ['(intersection)']: name } = dataset;
        const { [name]: handle } = handler;
        
        if (handle) handle.call(handler, entry, observer);
    }
    
    connect(target) {
        this.observe(target);
    }
    
};
