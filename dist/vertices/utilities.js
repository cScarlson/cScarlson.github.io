
const Utilities = class Utilities {
	
	get(namespace) {
		var namespace = namespace.replace('.', '?.');
		return new Function('o', `return o?.${namespace};`);
	}
    
    interpolate(str) {
		return (o) => (new Function(`with (this) return \`${str}\`;`) ).call(o);
    }
	
	supplant(string) {  // thx @DouglasCrockford
		const utils = this;
		
		return o => string.replace(/{([^{}]*)}/g, function replace(a, b) {
			var r = utils.get(b)(o);
			return typeof r === 'string' || typeof r === 'number' ? r : a;
		});
	}

}, utils = new Utilities();

export { utils as default, utils, Utilities };
