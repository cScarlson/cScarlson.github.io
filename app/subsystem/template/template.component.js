
import V, {} from '/vertices/core.js';

const { log } = console;
V('template', 'sandbox', function AboutComponent($) {
    this.use(`./app/subsystem/template/template.component.html`);
    return this;
});
