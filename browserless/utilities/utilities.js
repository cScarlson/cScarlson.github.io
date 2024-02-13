
export default {
	delay: (delay = 0) => new Promise( r => setTimeout(r, delay) ),
    uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    },
	get(namespace) {
		var namespace = namespace.replace('.', '?.');
		return new Function('o', `return o?.${namespace};`);
	},
	supplant(string) {  // thx @DouglasCrockford
		const utils = this;
		
		return o => string.replace(/{([^{}]*)}/g, function replace(a, b) {
			var r = utils.get(b)(o);
			return typeof r === 'string' || typeof r === 'number' ? r : a;
		});
	},
    interpolate(template) {
        return (data) => (new Function(`with (this) return \`${template}\`;`) ).call(data);
    },
	debounce(fn, delay) {
		let timer = null;
		
		return function debounce(...args) {
			const context = this;
			clearTimeout(timer);
			timer = setTimeout( x => fn.call(context, ...args), delay);
		};
	},
	throttle(fn, threshhold = 250, scope) {
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
};
