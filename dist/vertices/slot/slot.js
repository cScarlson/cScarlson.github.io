
import V, {} from '/dist/vertices/core.js';

V('slot', function Slot(element) {
    const { attributes, innerHTML: template, outerHTML } = this;
    const { name: attr={} } = attributes;
    const { name, value = '' } = attr;
    const key = 'projections';
    
    function inject(node) {
        const clone = node.cloneNode(true);
        element.appendChild(clone);
    }
    
    function handleData(e) {
        if ( !e.detail.has(value) ) return;
        const { detail: data } = e;
        const projections = data.get(value);
        
        element.innerHTML = '';
        projections.forEach(inject);
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.off('binding:response:slot', handleData, true);
    }
    
    this.on('binding:response:slot', handleData, true);
    this.fire('binding:request:slot', { type: 'slot', key });
    
    return this;
});
