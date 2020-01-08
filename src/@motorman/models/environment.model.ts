
class Environment {
    type: string = '';
    get production() { return !!{ 'production': true }[ this.type ]; }
    
    constructor(options: any = { }) {
        var { type } = options;
        
        this.type = type || this.type;
        
        return this;
    }
    
}

export { Environment };
