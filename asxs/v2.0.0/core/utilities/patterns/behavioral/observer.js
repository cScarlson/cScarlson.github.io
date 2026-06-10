
export class Subject {
    observers = new Set();
    undefined = {};
    key = this.undefined;
    get state() { return this[this.key] }
    
    constructor(undefined = {}, key = undefined) {
        this.undefined = undefined;
        this.key = key;
    }
    
    attach(observer, notify = false) {
        const { observers, state } = this;
        
        observers.add(observer);
        if (notify) observer.call(state);
        
        return this;
    }
    
    detach(observer) {
        const { observers } = this;
        observers.delete(observer);
        return this;
    }
    
    notify(state = this.state) {
        const { observers } = this;
        for (const observer of observers) observer.call(state);
        return this;
    }
    
};
