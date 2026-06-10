
import { utilities } from '/asxs/v2.0.0/core/utilities/utilities.js';

export class TemplateCrawler {
    template = document.querySelector('template');
    receiver = null;
    
    constructor(receiver) {
        this.receiver = receiver
        console.log(`@TemplateCrawler`, this.template);
    }
    
    #crawl(element, ...more) {
        if (!element) return;
        const { receiver } = this;
        const { attributes, children } = element;
        
        if ('crawler:template:handler' in receiver) receiver['crawler:template:handler'](element);
        this.#inspect(...attributes);
        if (more.length) this.#crawl(...more);
        this.#crawl(...children);
    }
    
    #inspect(attr, ...more) {
        if (!attr) return;
        const { name } = attr;
        const first = name.charAt(0);
        const action = `handle(${first})`;
        
        if (action in this) this[action](attr);
        if (more.length) this.#inspect(...more);
    }
    
    ['handle(.)'](attr) {
        if (!this.receiver[attr.value]) throw new Error(`Template Crawler Error: property "${attr.value}" does not exist in ${this.receiver.tagName}`);
        const { receiver } = this;
        const { name, value, ownerElement } = attr;
        const { [value]: datum } = receiver;
        const key = name.substring(1);
        
        ownerElement[key] = datum;
        console.log(`@ttr`, name, value, ownerElement[key], ownerElement);
    }
    
    ['handle(+)'](attr) {
        const { name } = attr;
        const action = `handle(${name})`;
        if (action in this) this[action](attr);
    }
    
    ['handle(+for)'](attr) {
        const { receiver } = this;
        const { name, value: expression, ownerElement } = attr;
        const { parentElement } = ownerElement;
        const [ token, key, _, iterable ] = expression.split(' ');
        const { [iterable]: collection } = receiver;
        const results = collection.map( (data, i) => this.clone(attr, ownerElement, key, data, i, collection) );
        const fragment = document.createElement('div');
        const joined = results.join('');
        const innerHTML = joined.replaceAll('+for', '-for');
        
        fragment.innerHTML = innerHTML;
        for (const child of fragment.children) console.log(child);
        for (const child of fragment.children) ownerElement.after(child);
        ownerElement.remove();
        console.log(`################`, parentElement, ownerElement, fragment, fragment.innerHTML);
    }
    
    clone = (attr, owner, key, data, i, collection) => {
        const { receiver } = this;
        const { outerHTML } = owner;
        const scope = Object.assign({}, receiver, { [key]: data }, { $index: i });
        const interpolated = utilities.interpolate(outerHTML)(scope);
        
        return interpolated;
    };
    
    execute() {
        const { template } = this;
        const { content } = template;
        const { children } = content;
        
        this.#crawl(...children);
    }
    
};
