
import { ElementNode } from '@motorman/vertices/core/decorators';
import { IElementSandbox } from '@app/core/sandbox';
import template from './playground.component.html';

class Calendar {
    public name: string = 'pgcal';
    
    constructor(private $: IElementSandbox) {}
    
    handleOutput(e: CustomEvent) {
        console.log('CAUGHT --- Calendar Output', e.type, e.target, e.currentTarget);
    }
    
}

@ElementNode({ selector: 'app-playground' })
class PlaygroundComponent {
    private calendar: Calendar = new Calendar(this.$);
    
    constructor(private $: IElementSandbox) {
        console.log('PLAYGROUND', $);
        $.state.set(this);
        $.content.set(template);
    }
    
    handleOutput(e: CustomEvent) {
        console.log('CAUGHT --- Calendar Output', e.type, e.target, e.currentTarget);
    }
    
}

export { PlaygroundComponent };
