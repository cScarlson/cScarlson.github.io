
import { ElementNode } from '@motorman/vertices/core/decorators';
import { IElementSandbox } from '@app/core/sandbox';
import template from './form.component.html';

@ElementNode({ selector: 'app-contact-form' })
class FormComponent {
    
    constructor(private $: IElementSandbox) {
        console.log('CONTACT FORM', $);
        $.content.set(template);
    }
    
    handleCaptchaChange(e: CustomEvent) {}
    
    handleSubmit(e: Event) {}
    
}

export { FormComponent };
