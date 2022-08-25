
class Store {  // uses The Observer Pattern (with ".call()" instead of ".update()")
    state = { };
    observers = new Set();
    reducer = () => { };
    
    constructor(options = {}) {
        const { reducer, state, notify = false } = options;
        
        this.reducer = reducer;
        this.state = state;
        if (notify) this.notify();
        
        return this;
    }
    
    dispatch(action) {
        var { reducer, state } = this;
        var ref = state;
        var state = reducer.execute(state, action);
        
        this.state = state;
        if (state !== ref) this.notify();
        
        return this;
    }
    
    update() {
        throw new Error(`Store Observer Error: observer was undefined.`);
    }
    
    attach(observer = this, notify = true) {
        const { state, observers } = this;
        
        observers.add(observer);
        if (notify) observer.call(state, state);
        
        return this;
    }
    
    detach(observer = this) {
        const { state, observers } = this;
        observers.delete(observer);
        return this;
    }
    
    notify(state = this.state) {
        var { observers } = this;
        var observers = [ ...observers ];
        
        observers.forEach( observer => observer.call(state, state) );
        
        return this;
    }
    
}

export { Store };
