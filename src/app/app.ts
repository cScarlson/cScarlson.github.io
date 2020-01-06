
import { environment as ENV } from '../environments/environment';

var console = window.console;
console.log('Included app.js');
console.log(`Running as ${ENV}`);

export class Hero {
    id: number = 998;
    name: string;

    constructor(name) {
        this.name = name;
    }
}

let hero = new Hero('krunal');
console.log('hero?', hero);

export { console as app };
