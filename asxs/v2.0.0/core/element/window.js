
export const root = (function get(window) {
    if (window !== window.parent) return get(window.parent);
    return window;
})(window);
export const safeTimeout = function timeout(...splat) {
    return root.setTimeout.call(root, ...splat);
};
