
import { ElementNode } from '@motorman/vertices/core/decorators';
import { IElementSandbox } from '@app/core/sandbox';
import template from './welcome.component.html';

@ElementNode({ selector: 'app-welcome' })
class WelcomeComponent {
    
    constructor(private $: IElementSandbox) {
        console.log('WELCOME', $);
        $.content.set(template);
    }
    
}

export { WelcomeComponent };
