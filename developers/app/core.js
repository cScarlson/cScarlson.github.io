
import { Sandbox } from '/developers/app/sandbox.js';

const { log } = console;
const config = new Map();

export { default as utilities } from '/browserless/utilities/utilities.js';
export { config };
export const $ = new (class Core extends Map {
    instances = new Map();
    sandbox = new Sandbox({ target: window });
    
    set(...splat) {
        const [ tagName, ...events ] = splat;
        const Class = events.pop();
        
        super.set(tagName, { tagName, events, Class });
        return this;
    }
    
    boot(name, element) {
        if ( !this.has(name) ) return;
        const { tagName, events, Class } = this.get(name);
        const sandbox = new Sandbox({ target: element });
        const instance = new Class(sandbox);
        const detail = { tagName, events, Class, instance };
        const hookReady ='hook:ready';
        const hooks = [ hookReady ];
        const event = new CustomEvent(hookReady, { detail });
        
        [ ...hooks, ...events ].forEach( type => element.addEventListener(type, instance, true) );
        element.dispatchEvent(event);
    }
    
});
