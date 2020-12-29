
import { V } from './v';

class MutationManager {
    dispatcher = new EventTarget();
    core = null;
    target = null;
    observer = new MutationObserver( (r, o) => this.observe(r, o) );
    defaults = {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true,
        // attributeFilter: true,
    };

    constructor({ core, target }) {
        this.core = core;
        this.target = target;
    }

    observe(changes, observer) {
        for(let mutation of changes) this['any'](mutation);
    }

    connect(config: any = {}) {
        var { observer, defaults, target } = this;
        var config = { ...defaults, ...config };
        
        observer.observe(target, config);
        return this;
    }

    disconnect() {
        var { observer } = this;
        observer.disconnect();
        return this;
    }

    ['any'](mutation) {
        var e = new CustomEvent('*', { detail: mutation });
        this.dispatcher.dispatchEvent(e);
        this[mutation.type](mutation);
    }
    ['attributes'](mutation) {
        var e = new CustomEvent('attributes', { detail: mutation });
        this.dispatcher.dispatchEvent(e);
    }
    ['childList'](mutation) {
        var e = new CustomEvent('childList', { detail: mutation });
        mutation.addedNodes.forEach( (c) => V.bootstrap(c) );
        this.dispatcher.dispatchEvent(e);
    }
    ['subtree'](mutation) {
        var e = new CustomEvent('subtree', { detail: mutation });
        this.dispatcher.dispatchEvent(e);
    }
    ['characterData'](mutation) {
        var e = new CustomEvent('characterData', { detail: mutation });
        this.dispatcher.dispatchEvent(e);
    }

    subscribe(channel, handler) {
        this.dispatcher.addEventListener(channel, handler, false);
        return this;
    }

}

export { MutationManager };
