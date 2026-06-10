
export class Reducer {
    
    execute = (state, action) => {
        const { type } = action;
        if (type in this) return this[type](state, action);
        return state;
    };
    
};
