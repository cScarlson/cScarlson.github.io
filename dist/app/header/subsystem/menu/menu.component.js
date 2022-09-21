
import V, {} from '/dist/vertices/core.js';

const { log } = console;
V('menu', 'sandbox', function MenuComponent($) {
    this.use('./app/header/subsystem/menu/menu.component.html');
    return this;
});
