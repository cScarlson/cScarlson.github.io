
import { Router, RouteComposite } from '@motorman/vertices/sdk/components/router';
import { ElementNode } from '@motorman/vertices';
import { IElementSandbox as Sandbox } from './core';
import { router } from './routing';

// console.log('-->', router);
@ElementNode({ selector: '[v*="app"][v*="root"]' })
export class AppComponent {
    private body: Element = document.body;
    // testType = 'checkbox';
    testType = 'text';
    testValue = '!!!';
    testName = 'a';
    
    constructor(private $: Sandbox) {
        // console.log('App', $);
        // setTimeout( () => this.testName = 'b', (1000 * 2) );
        // setTimeout( () => this.testType = 'radio', (1000 * 2) );
        // setTimeout( () => this.testValue = '... test! ...', (1000 * 2) );
        setTimeout( () => $.publish('HUD:REQUESTED', { data: true, type: 'alert', content: '<h1>TESTING...123</h1>' }), (1000 * 2) );
        // setTimeout( () => $.publish('MODAL:DISMISSED', { data: true }), (1000 * 9) );
        // setTimeout( () => $.publish('MODAL:REQUESTED', { data: true, content: '<h1>TESTING......123</h1>' }), (1000 * 12) );
        // console.log('>>>', $.target.innerHTML);
        // $.content.set($.target.innerHTML);
        
        $.subscribe('MENU:REQUESTED', this.handleMenuRequest);
        $.subscribe('MENU:DISMISSED', this.handleMenuDismiss);
        router.subscribe('router:outlet:updated', this.handleRouterOutletUpdate );  // close menu if open
    }
    
    public handleMenuRequest = (e: CustomEvent) => {
        // console.log('MENU:REQUESTED', e);
        this.body.classList.add('inactive');
    };
    
    public handleMenuDismiss = (e: CustomEvent) => {
        // console.log('MENU:DISMISSED', e);
        this.body.classList.remove('inactive');
    };
    
    public handleRouterOutletUpdate = (e: CustomEvent<{ name: string, old: RouteComposite, route: RouteComposite }>) => {
        // ISSUE (minor): on'router:outlet:updated' the state of the menu-icon is not updated.
        this.body.classList.remove('inactive');
    };
    
}
