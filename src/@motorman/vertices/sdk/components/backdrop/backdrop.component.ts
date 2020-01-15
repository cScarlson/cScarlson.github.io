
import { Element, attr, handler, message } from '@motorman/vertices';
import { Sandbox } from '@motorman/core';

@Element({ name: 'v-backdrop', template: `` })
export class BackdropComponent {
    @attr() active: boolean = false;
    @attr() options: any = { };
    
    constructor(private $: Sandbox) {}
    
    ['[options]'](val, old) {
        console.log('>', val, old);
    }
    
    @handler('click') handleInteraction(e: Event) {
        var { $ } = this;
        this.active = false;
        $.publish($.channels['BACKDROP:DISMISSED']);
    }
    
    @message('BACKDROP:REQUESTED') handleRequest(e: CustomEvent) {
        var { type, detail } = e;
        console.log('@ BackdropComponent', type, detail);
        this.active = true;
    }
    
}
