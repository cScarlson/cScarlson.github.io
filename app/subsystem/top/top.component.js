
import V, {} from '/vertices/core.js';

const { log } = console;
V('top', 'sandbox', function AboutComponent($) {
    this.use(`./app/subsystem/top/top.component.html`);
    return this;
});
