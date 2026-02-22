
import { Subject } from '@asxs/core/utilities/patterns/behavioral';
import type { Action } from './types';
import { Reducer } from './reducer';

export class Store<T = any> extends Subject<T> {
    
    constructor(public data: Partial<T> = {}, protected reducer: Reducer<T>) {
        super(data, 'data');
    }
    
    dispatch(action: Action<T>): Store<T> {
        const { reducer, data } = this;
        
        this.data = reducer.execute(data as T, action);
        if (this.data !== data) this.notify();
        
        return this;
    }
    
};
