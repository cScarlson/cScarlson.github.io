
class Deferred {
    promise = null;
    _resolve = () => {};
    _reject = () => {};
    
    constructor() {
        const promise = new Promise(this.execute);
        this.promise = promise;
        return this;
    }
    
    execute = (resolve, reject) => {
        this._resolve = resolve;
        this._reject = reject;
    };
    
    resolve(value) {
        this._resolve(value);
        return this;
    }
    
    reject(reason) {
        this._reject(reason);
        return this;
    }
    
}

export { Deferred };
