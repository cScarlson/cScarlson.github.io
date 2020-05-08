
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
        console.log('Logo Loaded...', e.type, e.target, e.currentTarget);
    }
    
    handleLogoError(e: Event) {
        var { target: img }: any&{ target: HTMLImageElement } = e;
        console.warn('Logo Error...', e.type, e);
        img.src = 'assets/shadow.jpg';
    }
    
    handleClick(e: Event, x, y) {
        console.log('CLICK', e.type, x, y);
        return false;
    }
    
    handleMenuState(e: Event&{ target: HTMLInputElement }) {
        var { type, target } = e;
        var { checked } = target;
        if (checked) this.$.publish('MENU:REQUESTED');
        else this.$.publish('MENU:DISMISSED');
        console.log('MENU STATE', type, checked);
    }
    
}

export { HeaderComponent };
