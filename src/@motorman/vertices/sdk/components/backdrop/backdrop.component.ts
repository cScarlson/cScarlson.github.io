
import { Element } from '@motorman/vertices';
// import { Element, attr, watch, bind, handle } from '@motorman/vertices';
// import { Sandbox } from '@motorman/core';

class SingletonComponentRequest { constructor(options: any = {}) {} }  // MOCK/TEMP

class BackdropRequest extends SingletonComponentRequest {
    id: string = '';
    
    constructor(options: any = {}) {
        super(options);
        var { id } = options;
        this.id = id || this.id;
        return this;
    }
    
}

@Element({ name: 'v-backdrop' })
export class BackdropComponent {
    // @attr() active: boolean = false;
    // @attr() options: any = { };
    // public request: BackdropRequest = new BackdropRequest({});
    
    // constructor(private $: Sandbox) {}
    
    // @watch('options') watchOptions(val, old) {
    //     console.log('>', val, old);
    // }
    
    // @bind('click') handleInteraction(e: Event) {
    //     var { $, request } = this;
    //     $.publish($.channels['BACKDROP:INSPECTED'], request);
    // }
    
    // @handle('BACKDROP:REQUESTED') handleRequest(e: CustomEvent) {
    //     var { type, detail } = e, request = new BackdropRequest(detail);
    //     console.log('@ BackdropComponent', type, detail);
    //     this.request = request;
    //     this.active = true;
    // }
    
    // @handle('BACKDROP:DISMISSED') handleDismissed(e: CustomEvent) {
    //     var { type, detail } = e;
    //     console.log('@ BackdropComponent', type, detail);
    //     this.active = false;
    // }
    
}
