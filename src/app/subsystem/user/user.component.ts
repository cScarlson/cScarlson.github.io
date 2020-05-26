
import { ElementNode } from '@motorman/vertices/core/decorators';
import { IActiveRouteDetails } from '@motorman/vertices/sdk/components/router';
import { IElementSandbox } from '@app/core/sandbox';
import { router } from '@app/routing';
import template from './user.component.html';

@ElementNode({ selector: 'app-user-token-getter' })
class UserTokenGetterComponent {
    private platform: any = '?';
    
    constructor(private $: IElementSandbox) {
        // console.log('USER', $);
        // console.log('USER', router.route);
        $.subscribe('USER:FOUND', (e) => console.log('@USER', e.detail));
        router.attach(this, true);
        $.state.set(this);
        $.content.set(template);
    }
    
    update(state: IActiveRouteDetails) {
        if (!state.route.name) return;
        var { params } = state;
        var { token, expiration, platform } = params, type = platform.toUpperCase();
        
        this.$.publish(`USER:TOKEN:FOUND:${type}`, token);
        this.$.publish('USER:TOKEN:FOUND', { token, expiration, platform });
        history.go(-3);
    }
    
}

export { UserTokenGetterComponent };
