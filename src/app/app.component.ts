
import { ElementNode } from '@motorman/vertices';
import { Sandbox } from './core';

@ElementNode({ selector: '[v*="app"][v*="root"]' })
export class AppComponent {
    
    constructor(private $: Sandbox) {
        // console.log('App', $);
        setTimeout( () => $.publish('MODAL:REQUESTED', { data: true, content: '<h1>TESTING...123</h1>' }), (1000 * 4) );
        // setTimeout( () => $.publish('MODAL:DISMISSED', { data: true }), (1000 * 9) );
    }
    
}
