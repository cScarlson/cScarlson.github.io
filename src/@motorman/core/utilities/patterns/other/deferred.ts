
/**
 * @name: Deferred Promise
 * @intention
 *  * Externalize the function of a Promise's "Executor" parameters so that fulfillment & rejection
 *  * can be performed at a later time.
 */
class Deferred<T> {
    private _resolve: Function = () => {};
    private _reject: Function = () => {};
    public promise: Promise<T> = new Promise<T>( this.exe.bind(this) );
        
    constructor() {}
    
    private exe(resolve, reject) {
        this._resolve = resolve;
        this._reject = reject;
    }
    
    resolve(data) {
        this._resolve(data);
        return this.promise;
    }
    reject(data) {
        this._reject(data);
        return this.promise;
    }
    
}

export { Deferred };
