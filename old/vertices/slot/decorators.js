
const Slot = function Slot(element) {
    const { $ } = this;
    const { childNodes = [] } = $;
    const projections = childNodes.reduce( reduce, new Map() );
    
    function reduce($, node) {
        const { slot = '' } = node;
        const has = $.has(slot);
        
        if (!has) $.set(slot, [ ]);
        $.get(slot).push(node);
        
        return $;
    }
    
    if (!projections.size) return this;
    this.$ = { ...$, projections };
    
    return this;
};

const BindingExchangeSlot = function BindingExchangeSlot(element) {
    const { $, tagName } = this;
    
    function handleRequest(e) {
        const { detail, target } = e;
        const { projections: fallback } = element;
        const { projections: data = fallback } = $;
        
        if (!data) return;
        if (tagName === 'SLOT') return;  // <slot>s are assumed to have children naturally.
        target.fire('binding:response:slot', data);
        e.stopPropagation();
        e.stopImmediatePropagation();
    }
    
    this.on('binding:request:slot', handleRequest, false);
    
    return this;
};

export { Slot, BindingExchangeSlot };
