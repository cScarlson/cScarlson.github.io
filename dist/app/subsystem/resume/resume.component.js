
import V, {} from '/dist/vertices/core.js';
import { Page } from '/dist/app/subsystem/page.js';

const { log } = console;
V('resume', 'sandbox', function ResumeComponent($) {
    const uri = `./app/subsystem/resume/resume.component.html`;
    
    // export precepts
    this.use(uri);
    
    return this;
});
