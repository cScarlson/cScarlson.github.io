
import { Subject } from '/asxs/v2.0.0/core/utilities/patterns/behavioral/observer.js';
import { Reducer } from './reducer.js';

export class Store extends Subject {
    data = {};
    
    constructor(data = {}, reducer) {
        super(data, 'data');
    }
    
    dispatch(action) {
        const { reducer, data } = this;
        
        this.data = reducer.execute(data, action);
        if (this.data !== data) this.notify();
        
        return this;
    }
    
};
