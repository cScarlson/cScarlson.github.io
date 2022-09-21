
import V, {} from '/vertices/core.js';
import { Page } from '/app/subsystem/page.js';

const { log } = console;
V('top', 'sandbox', function AboutComponent($) {
    this.use(`./app/subsystem/top/top.component.html`);
    return this;
});
