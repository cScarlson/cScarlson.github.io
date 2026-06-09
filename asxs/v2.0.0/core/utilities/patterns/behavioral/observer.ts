
type Observer<T = any> = ObserverObject<T> | ObserverFunction<T>;
type ObserverFunction<T = any> = (this: ObserverFunction<T>) => any;

interface ObserverObject<T = any> {
    call(this: any, state: T): any;
}

export type { Observer };
export class Subject<T = any> {
    observers: Set<Observer<T>> = new Set();
    get state(): T { return this[this.key as string] }
    
    constructor(protected undefined: any = {}, public key: string|undefined = undefined) {}
    
    attach(observer: Observer<T>, notify: boolean = false): Subject<T> {
        const { observers, state } = this;
        
        observers.add(observer);
        if (notify) observer.call(state);
        
        return this;
    }
    
    detach(observer: Observer<T>): Subject<T> {
        const { observers } = this;
        observers.delete(observer);
        return this;
    }
    
    notify(state: T = this.state): Subject<T> {
        const { observers } = this;
        for (const observer of observers) observer.call(state);
        return this;
    }
    
};
