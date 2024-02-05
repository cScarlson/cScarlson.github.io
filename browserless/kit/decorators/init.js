
export function init(Class, method = 'initialize', callback = (...o) => o) {
    return async function construct(element) {
        const options = callback(element);
        const instance = new Class(element);
        
        if (method !== 'noop') await instance[method](...options);
        
        return instance;
    };
};
