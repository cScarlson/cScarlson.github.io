
import { Sandbox } from '/developers/app/sandbox.js';

const { log } = console;
const config = new Map();

export { default as utilities } from '/browserless/utilities/utilities.js';
export { Queue } from './core/utilities/ds/queue.js';
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
        if ( !this.has(name) ) return { name, element };
        const { tagName, events, Class } = this.get(name);
        const sandbox = new Sandbox({ target: element });
        const instance = new Class(sandbox);
        const detail = { name, element, tagName, events, Class, instance };
        const hookReady ='hook:ready';
        const hooks = [ hookReady ];
        const event = new CustomEvent(hookReady, { detail });
        
        [ ...hooks, ...events ].forEach( type => element.addEventListener(type, instance, true) );
        
        return { ...detail, event };
    }
    
});
