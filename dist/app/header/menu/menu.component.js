
import V, {} from '/vertices/core.js';

const { log } = console;
V('menu', 'sandbox', function MenuComponent($) {
    setTimeout( () => $.use('./app/header/menu/menu.component.html'), 1000 * 3 * 0 );
    log(`@menu`);
    return this;
});
