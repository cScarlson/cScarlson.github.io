
const { top } = window;
const { customElements } = top;

export { customElements };
export function customElement(tagName, options = {}) {
    if (tagName === 'mag-article-collection') console.log(`@customElement-1`, tagName);
    return function decorate(Class) {
        if (tagName === 'mag-article-collection') console.log(`@customElement-2`, tagName);
        if ( customElements.get(tagName) ) return Class;
        customElements.define(tagName, Class, options);
        return Class;
    };
};
