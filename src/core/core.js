
import { CustomElement } from './custom.element.js';
import { Page } from './page.js';
import { translate } from './utilities/l10n/translate.js';
import { default as utilities } from './utilities/utilities.js';

const { customElements, console } = window;
const { log } = console;
const store = new (class Store {  // cheap store. provide interface for scalability. no reactivity needed yet.
    state = {
        isMenuOpen: false,
    };
    
    dispatch = (action) => {
        const { state } = this;
        const { type, payload } = action;
        
        if (type in this) this.state = this[type](state, action);
        
        return this;
    };
    
    ['HEADER:MENU:CLICK'](state, action) {
        const { payload: isMenuOpen } = action;
        return { ...state, isMenuOpen };
    }
    
})();

const Facade = function Facade(core) {
    
    function define(...splat) {
        core.define(...splat);
        return this;
    }
    
    function publish(...splat) {
        core.publish(...splat);
        return this;
    }
    function subscribe(...splat) {
        core.subscribe(...splat);
        return this;
    }
    function unsubscribe(...splat) {
        core.unsubscribe(...splat);
        return this;
    }
    
    // export precepts
    this.utilities = utilities;
    this.translate = translate;
    this.define = define;
    this.publish = publish;
    this.subscribe = subscribe;
    this.unsubscribe = unsubscribe;
    
    return this;
};

class Core {
    #medium = new EventTarget();
    #store = store;
    
    #dispatch(channel, data) {
        const event = new MessageEvent(channel, { data });
        this.#medium.dispatchEvent(event);
        return this;
    }
    
    publish(channel, data) {
        if (channel in this) this[channel](channel, data);
        else this.#dispatch(channel, data);
        return this;
    }
    
    subscribe(channel, handler) {
        this.#medium.addEventListener(channel, handler, true);
        return this;
    }
    
    unsubscribe(channel, handler) {
        this.#medium.removeEventListener(channel, handler, true);
        return this;
    }
    
    async define(tagName, Component, options) {
        customElements.define(tagName, Component, options);
    }
    
    async ['HEADER:MENU:CLICK'](channel) {
        const { state } = this.#store;
        const { isMenuOpen } = state;
        
        if (isMenuOpen) this.publish('MENU:REQUEST:HIDE');
        else this.publish('MENU:REQUEST:SHOW');
        this.#store.dispatch({ type: channel, payload: !isMenuOpen });
        this.#dispatch(channel);
    }
    
    async ['MENU:CLOSED'](channel) {
        this.#store.dispatch({ type: 'HEADER:MENU:CLICK', payload: false });
        this.#dispatch(channel);
    }
    
}

const V = new (function Vertex(Core, Facade) {
    return Facade.call(function v(tagName, Component, options) {
        if (this instanceof V) return new Vertex(Core, Facade);
        return v.define(tagName, Component, options);
    }, new Core() );
})(Core, Facade);

export { V as $, CustomElement, Page };
