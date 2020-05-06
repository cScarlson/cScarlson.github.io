
import { ElementNode } from '@motorman/vertices/core/decorators';
import { IElementSandbox } from '@app/core/sandbox';
import template from './header.component.html';
window['handleError'] = function z(e) {
    console.log('wow!', e);
};
@ElementNode({ selector: 'app-header' })
class HeaderComponent {
    public title: string = 'Home';
    
    constructor(private $: IElementSandbox) {
        // $.state.set(this);
        $.content.set(template);
        console.log('HEADER', $);
    }
    
    handleLogoLoad(e: Event) {
        console.log('Logo Loaded...', e.type, e);
    }
    
    handleLogoError(e: Event) {
        console.warn('Logo Error...', e.type, e);
    }
    
    handleClick(e: Event, x, y) {
        console.log('CLICK', e.type, x, y);
        return false;
    }
    
}

export { HeaderComponent };
