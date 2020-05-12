
import { ElementNode } from '@motorman/vertices/core/decorators';
import { IElementSandbox } from '@app/core/sandbox';
import template from './header.component.html';
import { router } from '@app/routing';

@ElementNode({ selector: 'app-header' })
class HeaderComponent {
    private menu: HTMLInputElement;
    public title: string = 'Home';
    
    constructor(private $: IElementSandbox) {
        // $.state.set(this);
        $.content.set(template);
        console.log('HEADER', $);
        router.subscribe('router:outlet:updated', this.handleRouterOutletUpdate );  // close menu if open
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
    
    public handleRouterOutletUpdate = (e: CustomEvent) => {
        this.menu.checked = false
    };
    
}

export { HeaderComponent };
