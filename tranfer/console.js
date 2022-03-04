
const noop = new (class NoopConsole {
    
    log(...extraneous) {}
    warn(...extraneous) {}
    error(...extraneous) {}
    clear(...extraneous) {}
    
})();

export default noop;
