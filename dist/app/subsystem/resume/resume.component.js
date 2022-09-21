
import V, {} from '/vertices/core.js';
import { Page } from '/app/subsystem/page.js';

const { log } = console;
V('resume', 'sandbox', function ResumeComponent($) {
    const uri = `./app/subsystem/resume/resume.component.html`;
    
    // export precepts
    this.use(uri);
    
    return this;
});
