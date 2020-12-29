
import { ElementNode } from '@motorman/vertices/core/decorators';
import { IActiveRouteDetails } from '@motorman/vertices/sdk/components/router';
import { IElementSandbox } from '@app/core/sandbox';
import template from './header.component.html';
import { router } from '@app/routing';
import { User } from '@app/subsystem/user/user.model';

@ElementNode({ selector: 'app-header' })
class HeaderComponent {
    private navable: any = !!router.history.length;  // this should exist in <app-back/>
    private menu: HTMLInputElement;
    public title: string = 'Home';
    public user: User = new User({ avatar: 'assets/shadow.jpg', link: '/#/' });
    
    constructor(private $: IElementSandbox) {
        $.state.set(this);
        $.content.set(template);
        console.log('HEADER', $);
        $.subscribe('user', this.handleUser);
        router.subscribe('router:outlet:updated', this.handleRouterOutletUpdate );  // close menu if open
    }
    
    handleLogoLoad(e: Event) {
        console.log('Logo Loaded...', e.type);
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
        var { $ } = this;
        var { type, target } = e;
        var { checked } = target;
        
        if (checked) this.$.publish('MENU:REQUESTED');
        else this.$.publish('MENU:DISMISSED');
        
        console.log('MENU STATE', type, checked);
    }
    
    handleAvatarError(e: Event) {
        if ( this.user.avatar === 'assets/linkedin.png') return (e.target as Element).classList.add('inactive');
        if ( (e.target as HTMLImageElement).src === 'assets/linkedin.png') return img.classList.add('inactive');
        var { target } = e;
        var img: HTMLImageElement = <any>target;
        
        // img.src = this.user.avatar;
        img.classList.add('active');
        
        console.log(img.src, e);
    }
    
    public handleRouterOutletUpdate = (e: CustomEvent<IActiveRouteDetails>) => {
        var { detail } = e;
        var { route } = detail;
        var { data } = route;
        var { title } = data;
        
        this.title = title;
        this.menu.checked = false;
        this.$.state.set(this);
    };
    
    public handleUser = (e: CustomEvent<User>) => {
        var { type, detail: user } = e;
        var user = new User(user);
        
        this.user = user;
        this.$.state.set(this);
    };
    
}

export { HeaderComponent };
