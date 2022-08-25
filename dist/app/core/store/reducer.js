

class Reducer {
    middleware = new Set();
    
    constructor(middleware = new Set()) {
        this.middleware = middleware;
    }
    
    execute(state, action) {
        var { middleware } = this;
        var { type, payload } = action;
        var middleware = [ ...middleware ];
        var state = middleware.reduce( (s, fn) => fn.call(s, action), state );
        
        if (type in this) return this[type](state, payload);
        return state;
    }
    
    ['ANOTHER:TEST'](state, payload) {
        var state = { ...state, ...payload };
        return state;
    }
    
}

export { Reducer };
