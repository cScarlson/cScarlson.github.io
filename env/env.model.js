
export class Environment {
    type = 'prd';
    
    constructor(options = {}) {
        const { type } = { ...this, ...options };
        this.type = type;
        return this;
    }
    
};
