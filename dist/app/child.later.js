
import V, {} from '/dist/vertices/core.js';

V('child:later', 'sandbox', function ChildLater($) {
    const thus = this;
    const items = [
        { id: 0, name: 'a', title: "A" },
        { id: 1, name: 'b', title: "B" },
        { id: 2, name: 'c', title: "C" },
    ];
    
    this.items = items;
    this.innerHTML = [
        '<slot name="header">name="header"</slot>',
        '<ul>',
            '<each for="item:items">',
                '<li>',
                    '<slot name="">name=""</slot>',
                    '"${item.id}":"${item.name}":"${item.title}"',
                '</li>',
            '</each>',
        '</ul>'
    ].join('');
    // $.log(`@child:later`, this, $);
    $.publish('child:later:ready', { hey: 'child:later' });
    $.dispatch({ type: 'ANOTHER:TEST', payload: { test: 'yes' } });
    setTimeout(function clt() {
        const each = thus.querySelector('each[for="item:items"]');
        
        items.push({ id: 3, name: 'd', title: "D" });
        each.fire('each:rerender', 'item:items');
    }, 5000);
    
    return this;
});
