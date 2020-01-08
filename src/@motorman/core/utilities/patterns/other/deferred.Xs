
/**
 * @name: Deferred Promise
 * @intention
 *  * Externalize the function of a Promise's "Executor" parameters so that fulfillment & rejection
 *  * can be performed at a later time.
 */
var Deferred = function Deferred(...params) {
    var PRIVATE = this;
    var _resolve = null, _reject = null;
    
    function exe(resolve, reject) {
        this.resolve = resolve;
        this.reject = reject;
    }
    
    // export precepts
    this.resolve = _resolve;
    this.reject = _reject
    
    return new (class Deferred {
        
        constructor() {
            var promise = new Promise( exe.bind(this) );
            this.promise = promise;
            return this;
        }
        
        resolve(data) {
            PRIVATE.resolve(data);
            return this.promise;
        }
        reject(data) {
            PRIVATE.reject(data);
            return this.promise;
        }
        
    })(...params);
};

module.exports = { Deferred };
