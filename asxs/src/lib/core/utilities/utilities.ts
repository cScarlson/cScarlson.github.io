
import type { ToDo } from '@asxs/core/types';
import { markdown } from './markdown';

export const utilities = new (class Utilities {
	delay = (delay: number = 0) => new Promise( r => setTimeout(r, delay) );
	escapeHTML = html => markdown.escapeHTML(html);
    
    uuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
    
	get(namespace: string) {
		var namespace = namespace.replace('.', '?.');
		return new Function('o', `return o?.${namespace};`);
	}
    
	supplant(string: string) {  // thx @DouglasCrockford
		const utils = this;
		
		return o => string.replace(/{([^{}]*)}/g, function replace(a: ToDo, b) {
			var r = utils.get(b)(o);
			return typeof r === 'string' || typeof r === 'number' ? r : a;
		});
	}
    
    interpolate(template: string) {
        return (data: object) => (new Function(`with (this) return \`${template}\`;`) ).call(data) as string;
    }
    
	debounce(fn: Function, delay: number) {
		let timer: number = -1;
		
		return function debounce(...args) {
			const context = this;
			clearTimeout(timer);
			timer = setTimeout( x => fn.call(context, ...args), delay);
		};
	}
    
	throttle(fn: Function, threshhold: number = 250, scope: any) {
		let last, deferTimer;
		
		return function throttle(...args) {
			const context = scope || this;
			const now = +new Date;
			
			if (last && now < last + threshhold) {
				clearTimeout(deferTimer);
				deferTimer = setTimeout(function () {
					last = now;
					fn.apply(context, args);
				}, threshhold);
			} else {
				last = now;
				fn.apply(context, args);
			}
		};
	}
    
})();
