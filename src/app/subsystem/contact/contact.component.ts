
import { ElementNode } from '@motorman/vertices/core/decorators';
import { IElementSandbox } from '@app/core/sandbox';
import template from './contact.component.html';

@ElementNode({ selector: 'app-contact' })
class ContactComponent {
    
    constructor(private $: IElementSandbox) {
        console.log('CONTACT', $);
        $.content.set(template);
    }
    
}

export { ContactComponent };
