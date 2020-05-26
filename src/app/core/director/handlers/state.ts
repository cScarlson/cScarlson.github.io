
import { Reactive as Store } from '@motorman/core/store';
import { StateHandlers as CommonStateHandlers } from '@motorman/vertices/director/handlers';
import { User } from '@app/subsystem/user/user.model';
import { Director } from '../director';
import { Dependencies } from './dependencies';

class StateHandlers extends CommonStateHandlers {
    
    constructor(director: Director, $: Dependencies) {
        super(director, $);
        setTimeout( () => this.init(), (1000 * 2) );
    }
    
    init() {
        // var settings: Store = new Store({ id: 'settings' });
        // var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyLCJ1c2VyIjp7Im5hbWUiOnsiZmlyc3QiOiJDb2R5IiwibGFzdCI6IkNhcmxzb24ifSwidXNlcm5hbWUiOiJvdG9jYXJsc29uQGdtYWlsLmNvbSJ9fQ._XjXROxwEV6iJTsgkTVjVfJt4K-ojw8IbHzvkauqfFU';
        // var user = {
        //     "name": { "first": "Cody", "last": "Carlson" },
        //     "username": "otocarlson@gmail.com"
        // };
        // this.director.set('token', token);
        // this.director.set('user', user);
        // // this.in('settings[bbbb]').subscribe(this.handleState);
        // this.director.set(settings.id, settings);
        // [
        //     { id: 0, name: 'aaaa' },
        //     { id: 1, name: 'bbbb' },
        //     { id: 2, name: 'cccc' },
        // ].forEach( (d) => settings.set(d.name, d) );
    }
    
    log(e: CustomEvent, ...more: any[]) {
        var { type, detail } = e;
        console.log('@ STATE', type, detail);
    }
    
    ['token'](e: CustomEvent<string>) {
        var { type, detail: token } = e;
        var projections = `(id, localizedFirstName, localizedLastName, pictureURL, profilePicture(displayImage~digitalmediaAsset:playableStreams))`;
        var url = `https://api.linkedin.com/v2/me?projection=${projections}`
          , url = `https://cors-anywhere.herokuapp.com/${url}`
          ;
        var headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
        var options: RequestInit = { headers, method: 'GET', mode: 'cors' };
        var request = fetch(url, options);
        
        request
            .then( (res) => res.json() )
            .then(this.handleUser)
            .catch( (x: Response) => console.log('@CATCH-ME', x.status) )
            ;
        
        localStorage.setItem('token', token);
        // console.log('>', token);
        // this.log(e);
    }
    
    ['user'](e: CustomEvent<User>) {
        var { detail: user } = e;
        var json = JSON.stringify(user), copy = { ...user };
        localStorage.setItem('user', json);
        this.director.publish('USER:FOUND', copy);
    }
    
    private handleUser = (data: any) => {
        var { localizedFirstName: first, localizedLastName: last, id, profilePicture } = data;
        var { elements } = profilePicture['displayImage~'], avatar = elements[0].identifiers[0].identifier;
        // var link = `https://www.linkedin.com/in/{vanityName}`;
        var link = `https://www.linkedin.com`;
        var name = { first, last }, options = { id, avatar, link, name }, user = new User(options);
        
        console.log('>', data);
        this.director.set('user', user);
    };

}

export { StateHandlers };
