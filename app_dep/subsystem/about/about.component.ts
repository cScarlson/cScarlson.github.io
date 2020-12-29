
import { ElementNode } from '@motorman/vertices/core/decorators';
import { IElementSandbox } from '@app/core/sandbox';
import template from './about.component.html';

@ElementNode({ selector: 'app-about' })
class AboutComponent {
    
    constructor(private $: IElementSandbox) {
        console.log('ABOUT', $);
        $.content.set(template);
    }
    
}

export { AboutComponent };
