
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
	debounce(fn, delay) {  // thx @RemySharp
		let timer = null;
		
		return function debounce(...args) {
			const context = this;
			clearTimeout(timer);
			timer = setTimeout( x => fn.call(context, ...args), delay);
		};
	},
	throttle(fn, threshhold = 250, scope) {  // thx @RemySharp
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
	},
	datetime: {
		format(date, format='mm/dd/yyyy') {
			const d = new Date(date);
			const mm = d.getMonth() > 8 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1);
			const dd = d.getDate() > 9 ? d.getDate() : '0' + (d.getDate() + 1);
			const yyyy = d.getFullYear();
			const hh = d.getHours() > 12 ? d.getHours() - 12 : d.getHours();
			const _m = d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes();
			const ss = d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds() ;
			const xm = d.getHours() >= 12 ? 'PM' : 'AM';
			const formatted = {
				'mm/dd/yyyy': `${mm}/${dd}/${yyyy}`,
				'mm/dd/yyyy hh:mmXM': `${mm}/${dd}/${yyyy} ${hh}:${_m}${xm}`,
				'mm/dd/yyyy hh:mm:ssXM': `${mm}/${dd}/${yyyy} ${hh}:${_m}:${ss}${xm}`,
			}[ format ];
			
			return formatted;
		},
		diff(one, two, unit='days') {
			var one = new Date(one), two = new Date(two);
			const day = (1000 * 60 * 60 * 24);
			const diff = parseInt( Math.abs((one - two) / day) );
			const result = {
				'days': diff,
				'hours': Math.floor(diff * 24),
				'weeks': Math.floor(diff / 7),
				'months': Math.floor(diff / 30),
				'years': Math.floor(diff / 365),
			}[ unit ];
			
			return result;
		}
	},
};
