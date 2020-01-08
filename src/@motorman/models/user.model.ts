
class Name {
    first: string = '';
    last: string = '';
    
    constructor(options: any = {}) {
        var { first, last } = options;
        var [ first = first, last = last ] = first || last || options.split(' ');  // assume string
        
        this.first = first || this.first;
        this.last = last || this.last;
        
        return this;
    }
    
}

class User {
    username: string = '';
    email: string = '';
    name: Name = new Name();
    get fullName() { return `${this.name.first} ${this.name.last}`; }
    
    constructor(options: any = {}) {
        var { username, email, name } = options;
        
        this.username = username || this.username;
        this.email = email || this.email;
        this.name = name || this.name;
        
        return this;
    }
    
}

export { User, Name };
