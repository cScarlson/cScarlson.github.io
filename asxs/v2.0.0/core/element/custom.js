
const { top } = window;
const { customElements } = top;

export { customElements };
export function customElement(tagName, options = {}) {
    
    return function register(Class) {
        if ( customElements.get(tagName) ) return Class;
        customElements.define(tagName, Class, options);
        return Class;
    };
};
