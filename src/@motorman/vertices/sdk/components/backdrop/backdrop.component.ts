
import { ElementNode } from '@motorman/vertices';
import { NodeSandbox as Sandbox } from '@motorman/vertices/core';

@ElementNode({ selector: 'v-backdrop' })
export class BackdropComponent {
    
    constructor(private $: Sandbox) {
        $.in('BACKDROP:REQUESTED').subscribe(this.handleRequest);
        $.in('BACKDROP:DISMISSED').subscribe(this.handleDismiss);
        $.state.set(this);
    }
    
    private handleRequest = (e: CustomEvent) => {
        this.$.node.setAttribute('active', 'true');
    };
    
    private handleDismiss = (e: CustomEvent) => {
        this.$.node.setAttribute('active', 'false');
    };
    
}
