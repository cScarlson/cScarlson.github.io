
class Arguments extends Map {
    get data() { return Object.fromEntries(this) }
    
    constructor(argv) {
        super();
        var map = this.parameterize(...argv);
    }
    
    parameterize(arg, ...more) {
        var [ key, value=null ] = arg.split('=');  // assume '=' sign
        var key = key.replace(/^--(.+)$/i, '$1');  // assume double--dash.
        
        this.set(key, value);
        if (more.length) return this.parameterize(...more);  // continue. return map on line below.
        return this;
    }
    
    toJSON() {
        return this.data;
    }
    
    valueOf() {
        return this.toJSON();
    }
    
}

export { Arguments };
