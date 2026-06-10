
export class PromiseEvent extends MessageEvent {
    deferred = Promise.withResolvers();
    get promise() { return this.deferred.promise }
    get resolve() { return this.deferred.resolve }
    
    preventDefault() {
        const { deferred: { reject } } = this;
        reject({ type: 'prevent-default' });
        super.preventDefault();
    }
    
}
