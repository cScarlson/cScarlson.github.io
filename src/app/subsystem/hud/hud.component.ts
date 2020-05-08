
import { ElementNode } from '@motorman/vertices/core/decorators';
import { IElementSandbox } from '@app/core/sandbox';
import template from './hud.component.html';

@ElementNode({ selector: 'app-hud' })
class HudComponent {
    
    constructor(private $: IElementSandbox) {
        console.log('HUD', $);
        $.content.set(template);
        // setTimeout( () => $.target.setAttribute('active', 'true'), (1000 * 3) );
    }
    
}

export { HudComponent };
