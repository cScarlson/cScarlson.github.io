
class Name {
    first: string = '';
    middle: string = '';
    last: string = '';
    get full(): string { return [ this.first, this.middle, this.last ].join(' '); }
    
    constructor(options: any = {}) {
        var { first, middle, last } = options;
        
        this.first = first || this.first;
        this.middle = middle || this.middle;
        this.last = last || this.last;
        
    }
    
}

class User {
    username: string = '';
    email: string = '';
    avatar: string = '';
    link: string = '';
    name: Name = new Name();
    
    constructor(options: any = {}) {
        var { username, email, name, first_name, middle_name, last_name, avatar, link } = options;
        
        this.username = username || this.username;
        this.email = email || this.email;
        this.avatar = avatar || this.avatar;
        this.link = link || this.link;
        this.name = new Name(name || this.name);
        if (first_name || middle_name || last_name) this.name = new Name({ first: first_name, middle: middle_name, last: last_name });
        
        return this;
    }
    
}

export { User };
