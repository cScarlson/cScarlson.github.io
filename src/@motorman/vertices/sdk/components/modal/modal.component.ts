
import { Queue } from '@motorman/core/utilities/ds';
import { V, Element, attr, watch, handler, message, pipe } from '@motorman/vertices';
import { Sandbox } from '@motorman/core';
import template from './modal.component.html';

class SingletonComponentRequest { constructor(options: any = {}) {} }  // MOCK/TEMP

class ModalRequest extends SingletonComponentRequest {
    id: string = '';
    template: string = '';  // <template id="selector">
    
    constructor(options: any = {}) {
        super(options);
        var { id } = options;
        this.id = id || this.id;
        return this;
    }
    
}

@Element({
    name: 'v-modal',
    template,
    // template: './modal.component.html',
    // lazy: !true,  // tells Vertices to expect a url
})
class ModalComponent {
    @attr() options: any = { };  // get options() { return new Function(`return ${value};`); }???
    // @attr() active: boolean = true;
    @attr() get active(): boolean { return !this.requests.isEmpty(); }
    // @attr() get active(): string { return ''+!this.requests.isEmpty(); }
    // set active(value: boolean) {  }
    protected requests: Queue<ModalRequest> = new Queue();
    // private request: ModalRequest = new ModalRequest({});
    get request(): ModalRequest { return this.requests.front(); }
    
    constructor(private $: Sandbox) {}
    
    @handler('click') handleClick(e: Event) {
        var { $, requests } = this;
        console.log('@modal # click', e);
    }
    
    @message('MODAL:REQUESTED') handleRequest(e: CustomEvent) {
        var { $, requests } = this;
        var { type, detail }: { type: string, detail: ModalRequest } = e;
        requests.enqueue(detail);
        $.publish($.channels['BACKDROP:REQUESTED'], { test: true });
    }
    
    @message('MODAL:DISMISSED') handleDismissed(e: CustomEvent) {
        var { $, requests } = this;
        var { type, detail } = e;
        console.log('@ ModalComponent', type, detail);
        requests.dequeue();
    }
    
}

export { ModalComponent };
