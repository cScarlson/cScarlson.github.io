
import V, {} from '/dist/vertices/core.js';

V('header', 'sandbox', function HeaderComponent($) {
    $.use('./app/header/header.component.html');
    return this;
});
