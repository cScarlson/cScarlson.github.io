
class Deferred {
    promise: Promise<any> = Promise.resolve('Deferred Error: uninitialized');
    _resolve: Function = () => {};
    _reject: Function = () => {};
    
    constructor() {
        const promise = new Promise(this.#execute);
        this.promise = promise;
        return this;
    }
    
    #execute = (resolve: Function, reject: Function) => {
        this._resolve = resolve;
        this._reject = reject;
    };
    
    resolve = (value: any) => {
        this._resolve(value);
        return this;
    };
    
    reject = (reason: unknown) => {
        this._reject(reason);
        return this;
    };
    
}

export { Deferred };
