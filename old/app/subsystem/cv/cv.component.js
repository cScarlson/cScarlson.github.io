
import V, {} from '/vertices/core.js';

const { log } = console;
V('cv', 'sandbox', function CVComponent($) {
    this.use(`./app/subsystem/cv/cv.component.html`);
    return this;
});
