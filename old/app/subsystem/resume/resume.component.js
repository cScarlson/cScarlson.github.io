
import V, {} from '/vertices/core.js';
import { Page } from '/app/subsystem/page.js';

const { log } = console;
V('resume', 'sandbox', function ResumeComponent($) {
    this.use(`./app/subsystem/resume/resume.component.html`);
    return this;
});
