
import { ElementNode } from '@motorman/vertices';
import { IElementSandbox as Sandbox } from './core';

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
        // setTimeout( () => $.publish('MODAL:REQUESTED', { data: true, content: '<h1>TESTING...123</h1>' }), (1000 * 0) );
        // setTimeout( () => $.publish('MODAL:DISMISSED', { data: true }), (1000 * 9) );
        // setTimeout( () => $.publish('MODAL:REQUESTED', { data: true, content: '<h1>TESTING......123</h1>' }), (1000 * 12) );
        // console.log('>>>', $.target.innerHTML);
        // $.content.set($.target.innerHTML);
        $.subscribe('MENU:REQUESTED', this.handleMenuRequest);
        $.subscribe('MENU:DISMISSED', this.handleMenuDismiss);
    }
    
    public handleMenuRequest = (e: CustomEvent) => {
        console.log('MENU:REQUESTED', e);
        this.body.classList.add('inactive');
    };
    
    public handleMenuDismiss = (e: CustomEvent) => {
        console.log('MENU:DISMISSED', e);
        this.body.classList.remove('inactive');
    };
    
}
