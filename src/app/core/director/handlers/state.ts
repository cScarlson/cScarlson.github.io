
import { Reactive as Store } from '@motorman/core/store';
import { Director } from '../director';

class Dependencies {
    public stats: Console = console;

    constructor(private Director: Director) {}
}

class StateHandlers {
    
    constructor(private director: Director, private $: Dependencies) {
        setTimeout( () => this.init(), (1000 * 2) );
    }
    
    init() {
        var settings: Store = new Store({ id: 'settings' });
        var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyLCJ1c2VyIjp7Im5hbWUiOnsiZmlyc3QiOiJDb2R5IiwibGFzdCI6IkNhcmxzb24ifSwidXNlcm5hbWUiOiJvdG9jYXJsc29uQGdtYWlsLmNvbSJ9fQ._XjXROxwEV6iJTsgkTVjVfJt4K-ojw8IbHzvkauqfFU';
        var user = {
            "name": { "first": "Cody", "last": "Carlson" },
            "username": "otocarlson@gmail.com"
        };
        this.director.set('token', token);
        this.director.set('user', user);
        // this.in('settings[bbbb]').subscribe(this.handleState);
        this.director.set(settings.id, settings);
        [
            { id: 0, name: 'aaaa' },
            { id: 1, name: 'bbbb' },
            { id: 2, name: 'cccc' },
        ].forEach( (d) => settings.set(d.name, d) );
    }
    
    log(e: CustomEvent, ...more: any[]) {
        var { type, detail } = e;
        // console.log('@ STATE', type, detail);
    }

    // 'token': log,
    // 'user': log,
    ['app/settings'](e: CustomEvent) {
        this.log(e);
    }
    ['app/settings/aaaa'](e: CustomEvent) {
        this.log(e, '<-- specifically targeted');
    }
    ['app/settings/*'](e: CustomEvent) {
        this.log(e);
    }
    ['**/settings/*'](e: CustomEvent) {
        this.log(e);
    }
    ['**/*/*'](e: CustomEvent) {
        this.log(e);
    }
    ['A'](e: CustomEvent) {
        this.log(e);
    }

}

export { StateHandlers };
