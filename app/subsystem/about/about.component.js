
import V, {} from '/vertices/core.js';
import { Page } from '/app/subsystem/page.js';

const { log } = console;
V('about', 'sandbox', function AboutComponent($) {
    this.use(`./app/subsystem/about/about.component.html`);
    return this;
});
