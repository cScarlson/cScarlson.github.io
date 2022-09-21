
import V, {} from '/dist/vertices/core.js';

const { log } = console;
V('home', 'sandbox', function HomeComponent($) {
    this.use(`./app/subsystem/home/home.component.html`);
    return this;
});
