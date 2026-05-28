
import type { ToDo } from '@asxs/core/types';

export class PromiseEvent<T = any> extends MessageEvent<T> {
    deferred: ToDo = (Promise as ToDo).withResolvers();
    get promise(): Promise<T> { return this.deferred.promise }
    get resolve(): Function { return this.deferred.resolve }
    
    preventDefault(): void {
        const { deferred: { reject } } = this;
        reject({ type: 'prevent-default' });
        super.preventDefault();
    }
    
}
