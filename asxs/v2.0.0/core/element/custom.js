
import { root } from './window.js';

const { customElements } = root;

export { customElements };
export function customElement(tagName, options = {}) {
    
    return function decorate(Class) {
        if ( customElements.get(tagName) ) return Class;
        customElements.define(tagName, Class, options);
        return Class;
    };
};
