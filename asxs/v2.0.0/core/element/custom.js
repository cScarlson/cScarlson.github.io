
const { parent } = window;
const { customElements } = parent;

export function customElement(tagName, options = {}) {
    
    return function decorate(Class) {
        if ( customElements.get(tagName) ) return Class;
        customElements.define(tagName, Class, options);
        return Class;
    };
};
