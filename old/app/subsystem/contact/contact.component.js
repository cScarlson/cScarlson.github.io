
import V, {} from '/vertices/core.js';

const { log } = console;
V('contact', 'sandbox', function AboutComponent($) {
    this.use(`./app/subsystem/contact/contact.component.html`);
    return this;
});
