
import V, {} from '/dist/vertices/core.js';
import { Page } from '/dist/app/subsystem/page.js';

const { log } = console;
V('about', 'sandbox', function AboutComponent($) {
    this.use(`./app/subsystem/about/about.component.html`);
    return this;
});
