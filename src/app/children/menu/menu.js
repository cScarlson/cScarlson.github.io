
import { f, console } from '/browserless/core.js';
import { metadata as meta } from '/browserless/kit/decorators/metadata.js';
import { Sandbox, translate } from '/src/app/core.js';

const { log } = console;
const metadata = {
    ...meta,
    template: './src/app/children/menu/menu.html',
    styles: './src/app/children/menu/menu.css',
};

f('my-menu', metadata, Sandbox, async function Menu($) {
    const clone = null;
    const translations = {
        title:      await translate('MENU:TITLE'),
        home:       await translate('MENU:ACTION:HOME'),
        about:      await translate('MENU:ACTION:ABOUT'),
        pricing:    await translate('MENU:ACTION:PRICING'),
        contact:    await translate('MENU:ACTION:CONTACT'),
        more:       await translate('MENU:ACTION:MORE'),
    };
    
    return new class {
        metadata = $.interpolate(translations);
        
        observe = (entries, observer) => {
            for (let entry of entries) this.handleIntersection(entry);
        };
        
        connectedCallback() {
            if ( $.element.classList.contains('global') ) return;
            const { element } = $;
            const options = { root: document.body, rootMargin: '0px', threshold: 1.0 };
            const observer = new IntersectionObserver(this.observe);
            
            observer.observe(element);
        }
        
        handleIntersection = (entry) => {
            const { isIntersecting } = entry;
            const { [`inx:${isIntersecting}`]: handle } = this;
            if (handle) handle.call(this, entry);
        };
        
        ['inx:true'](entry) {
            if (!this.clone) return;
            const { clone } = this;
            clone.remove();
        }
        
        ['inx:false'](entry) {
            const { target } = entry;
            const clone = target.cloneNode(true);
            
            this.clone = clone;
            clone.classList.add('global');
            document.body.appendChild(clone);
        }
        
    };
});
