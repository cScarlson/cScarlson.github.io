
import V, {} from '../core.js';
import utils, {} from '../utilities.js';

const { log } = console;
V('each', function Each(element) {
    const { attributes, innerHTML: template, outerHTML } = this;
    const { ['for']: attr } = attributes;
    const { name, value } = attr;
    const [ alias, key ] = value.split(':');
    const interpolate = utils.supplant(template);
    const state = null;
    
    function map(item) {
        const context = { [alias]: item };
        const interpolated = interpolate(context);
        return interpolated;
    }
    
    function map(item) {
        const context = { [alias]: item };
        const host = document.createElement('div');
        const interpolated = interpolate(context);
        const detail = { context, host };
        
        host.innerHTML = interpolated;
        // log(`@SUPPLANT`, interpolated);
        
        return detail;
    }
    
    function inject(detail) {
        const { host } = detail;
        const { childNodes } = host;
        const children = [ ...childNodes ];
        
        children.forEach( c => element.appendChild(c) );
    }
    
    function update(state) {
        const details = state.map(map);
        this[alias] = state;
        details.forEach(inject);
        // log(`@each.update`, alias, this[alias]);
    }
    
    function handleRerender(e) {
        if (e.detail !== value) return;
        element.outerHTML = outerHTML;
        e.stopPropagation();
        e.stopImmediatePropagation();
    }
    
    function handleBindingRequest(e) {
        if (e.target === element) return;
        const { [alias]: items } = this;
        log(`@each.binding:request`, items, this, e.target);
        // if (e.detail.type !== 'each') return;
        // const { detail, target } = e;
        // const { type, key } = detail;
        // const data = utils.get(key)(this[alias]);
        // log(`@EACH.handleBindingRequest`, type, alias, key, detail, data);
    }
    
    function handleEvent(e) {
        // if (e.target === element) return;
        const { type, target } = e;
        const handler = {
            'binding:request:each': handleBindingRequest,
            // 'binding:response:each': handleBindingResponse,
        }[ type ];
        
        // log(`@EACH.handleEvent`, type, target);
        if (!handler) return;
        handler.call(this, e);
    }
    
    function init() {
        this.on('each:rerender', handleRerender, true);
        this.on('binding:response:each', this, true);
        this.on('binding:request:each', this, true);
        this.fire('binding:request:each', { type: 'each', key }, { bubbles: false });
    }
    
    // export precepts
    this.state = state;
    this.init = init;
    this.update = update;
    this.handleEvent = handleEvent;
    element.innerHTML = '';
    log(`@EACH %O`, this, template);
    
    return this;
});
