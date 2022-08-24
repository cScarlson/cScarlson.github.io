
const BindingExchangeEach = function BindingExchangeEach(element) {
    const { $ } = this;
    
    function handleRequest(e) {
        const { detail, target } = e;
        const { type, key } = detail;
        const { [key]: fallback } = element;
        const { [key]: data = fallback } = $;
        
        if (!data) return;
        target.fire('binding:response:each', data);
        e.stopPropagation();
        e.stopImmediatePropagation();
    }
    
    this.on('binding:request:each', handleRequest, true);
    
    return this;
};

export { BindingExchangeEach };
