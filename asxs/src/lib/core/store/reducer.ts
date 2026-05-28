
import type { Action } from './types';

export class Reducer<T = any> {
    
    execute = (state: T, action: Action<T>) => {
        const { type } = action;
        if (type in this) return this[type](state, action);
        return state;
    };
    
};
