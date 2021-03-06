
import { Router, RouteComposite } from '@motorman/vertices/sdk/components/router';
import { ElementNode } from '@motorman/vertices';
import { environment } from '@environments/environment';
import { IElementSandbox as Sandbox } from './core';
import { router } from './routing';

@ElementNode({ selector: '[v*="app"][v*="root"]' })
export class AppComponent {
    private head: HTMLHeadElement = document.head;
    private body: HTMLBodyElement|HTMLElement = document.body;
    private title: HTMLTitleElement = this.head.querySelector('title');
    // testType = 'checkbox';
    testType = 'text';
    testValue = '!!!';
    testName = 'a';
    
    constructor(private $: Sandbox) {
        // console.log('App', $);
        var token = localStorage.getItem('token');
        
        // 'vattention'|'vmodal'|'vnote'|'valert'|'vconfirm'|'vprompt';
        
        // setTimeout( () => $.publish('HUD:REQUESTED', { backdrop: false, type: 'vattention', content: '<h1>TESTING...123</h1>' }), (1000 * 2) );
        // setTimeout( () => $.publish('HUD:REQUESTED', { backdrop: true, type: 'vmodal', content: '<h1>TESTING...123</h1>' }), (1000 * 3) );
        // setTimeout( () => $.publish('HUD:REQUESTED', { backdrop: false, type: 'vnote', content: '<h1>TESTING...123</h1>' }), (1000 * 4) );
        // setTimeout( () => $.publish('HUD:REQUESTED', { backdrop: true, type: 'valert', content: '<h1>TESTING...123</h1>' }), (1000 * 0) );
        // setTimeout( () => $.publish('HUD:REQUESTED', { backdrop: true, type: 'vconfirm', content: '<h1>TESTING...123</h1>' }), (1000 * 0) );
        // setTimeout( () => $.publish('HUD:REQUESTED', { backdrop: true, type: 'vprompt', content: '<h1>TESTING...123</h1>' }), (1000 * 0) );
        // $.content.set($.target.innerHTML);
        
        // this.title.innerHTML = `...`;
        if (token) console.log('USER:TOKEN:FOUND:LINKEDIN', this.title);
        if (token) $.publish('USER:TOKEN:FOUND:LINKEDIN', token);
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
        var { detail } = e;
        var { route } = detail;
        
        this.title.innerHTML = route.data.title;
        this.body.classList.remove('inactive');
    };
    
}
