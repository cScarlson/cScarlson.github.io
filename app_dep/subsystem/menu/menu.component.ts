
import { ElementNode } from '@motorman/vertices/core/decorators';
import { IElementSandbox } from '@app/core/sandbox';
import { router } from '@app/routing';
import template from './menu.component.html';

@ElementNode({ selector: 'app-menu' })
class MenuComponent {
    private route: any = { };
    public get name(): string { if (this.route) return this.route.name; }
    public get title(): string { if (this.route && this.route.data) return this.route.data.title; else return ''; }
    
    constructor(private $: IElementSandbox) {
        console.log('MENU', $);
        $.state.set(this);
        $.content.set(template);
        router.subscribe('router:outlet:updated', this.handleRouteChange);
    }
    
    isActive(name: string) {
        var active = name === this.name || '';
        return active;
    }
    
    public handleRouteChange = (e: CustomEvent) => {
        var { type, detail } = e;
        var { route } = detail;
        var { data } = route;
        var { title } = data;
        
        this.route = route;
        this.$.state.set(this);
    };
    
}

export { MenuComponent };
