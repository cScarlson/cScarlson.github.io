
class Mutations {
    core = null;
    observer = null;
    element = null;
    config = { childList: true, subtree: true };
    
    constructor({ core, element }) {
        const { config } = this;
        const observer = new MutationObserver(this.observe);
        
        this.core = core;
        this.observer = observer;
        this.element = element;
        element.addEventListener('destroy', this.handleDestroy, false);
        observer.observe(element, config);
    }
    
    observe = (mutations, observer) => {
        for (let record of mutations) this['handle:any'](record);
    };
    
    ['handle:any'](mutation) {
        const { type } = mutation;
        const action = `handle:${type}`;
        if (action in this) this[action](mutation);
    }
    
    ['handle:childList'](mutation) {
        this['handle:childList:addedNodes'](mutation);
        this['handle:childList:removedNodes'](mutation);
    }
    
    ['handle:childList:addedNodes'](mutation) {
        var { core } = this;
        var { addedNodes } = mutation;
        var addedNodes = [ ...addedNodes ];
        var elements = addedNodes.filter( n => n.nodeType === Node.ELEMENT_NODE );
        
        // log(`@addedNodes`, elements.length, elements);
        core.bootstrap(...elements);
    }
    
    ['handle:childList:removedNodes'](mutation) {
        const { removedNodes } = mutation;
        const elements = [ ...removedNodes ].filter( n => n.nodeType === Node.ELEMENT_NODE );
        elements.forEach(this.destroyNode);
    }
    
    destroyNode = (node) => {
        const e = new MessageEvent('destroy', { data: node });
        node.dispatchEvent(e);
    };
    
    destroy() {
        const { observer } = this;
        observer.disconnect();
        // log(`destroyed`);
    }
    
    handleDestroy = (e) => {
        if (this.element !== e.data) return;
        const { element, core } = this;
        const { observers } = core;
        
        e.stopPropagation();
        e.stopImmediatePropagation();
        element.removeEventListener('destroy', this.handleDestroy, false);
        observers.delete(element);
        this.destroy();
    };
    
}

export { Mutations };
