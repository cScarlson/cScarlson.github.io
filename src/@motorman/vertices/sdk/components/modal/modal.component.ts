
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
    @attr() options: any = { };
    // @attr() get options() { return new Function(`return ${value};`); }
    //         set options(value: string) { this.config = `${value}`; }
    @attr() get active(): boolean { return !this.requests.isEmpty(); }
    //         set active(value: boolean) {  }
    //         set active(value: boolean) { if (!value) this.requests.dequeue(); }
    protected requests: Queue<ModalRequest> = new Queue();
    get request(): ModalRequest { return this.requests.front(); }
    // @attr() ['onclick']: Function = () => {};
    
    constructor(private $: Sandbox) {}
    
    // @handler('click', '.close.icon') handleClick(e: Event) {  // needs option for selector?
    //     var { $, requests } = this;
    //     console.log('@modal # click', e);
    // }
    
    handleClick(e, active, adHoc) {
        console.log('@event', e.type, active, adHoc);
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
