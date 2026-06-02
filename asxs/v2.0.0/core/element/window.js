
export const root = (function get(window) {
    if (window !== window.parent) return get(window.parent);
    return window;
})(window);
