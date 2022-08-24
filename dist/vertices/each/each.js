
import V, {} from '../core.js';
import utils, {} from '../utilities.js';

V('each', function Each(element) {
    const { attributes, innerHTML: template, outerHTML } = this;
    const { ['for']: attr } = attributes;
    const { name, value } = attr;
    const [ alias, key ] = value.split(':');
    const interpolate = utils.interpolate(template);
    
    function map(item) {
        const context = { [alias]: item };
        const interpolated = interpolate(context);
        return interpolated;
    }
    
    function handleData(e) {
        if (e.target !== element) return;
        const { detail: data } = e;
        const interpolations = data.map(map);
        const innerHTML = interpolations.join('');
        
        element.innerHTML = innerHTML;
        e.stopPropagation();
        e.stopImmediatePropagation();
    }
    
    function handleRerender(e) {
        if (e.detail !== value) return;
        element.outerHTML = outerHTML;
        e.stopPropagation();
        e.stopImmediatePropagation();
    }
    
    function init() {
        this.on('each:rerender', handleRerender, true);
        this.on('binding:response:each', handleData, true);
        this.fire('binding:request:each', { type: 'each', key }, { bubbles: false });
    }
    
    this.init = init;
    
    return this;
});
