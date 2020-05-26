
import { ElementNode } from '@motorman/vertices/core/decorators';
import { IElementSandbox } from '@app/core/sandbox';
import template from './popstate.component.html';
import { router } from '@app/routing';

@ElementNode({ selector: 'app-back' }) class PopstateComponent {
    get poppable(): boolean { return false; }
    
    constructor(private $: IElementSandbox) {
        // console.log('PopstateComponent', $);
        $.state.set(this);
        $.content.set(template);
    }
    
    handleClick(e: Event) {
        console.log('clicked', e);
    }
    
}

export { PopstateComponent };
