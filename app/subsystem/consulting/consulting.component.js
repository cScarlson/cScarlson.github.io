
import V, {} from '/vertices/core.js';

const { log } = console;
V('consulting', 'sandbox', function AboutComponent($) {
    this.use(`./app/subsystem/consulting/consulting.component.html`);
    return this;
});
