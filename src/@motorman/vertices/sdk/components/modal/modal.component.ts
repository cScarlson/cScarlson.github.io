
import { Queue } from '@motorman/core/utilities/ds';
import { V } from '@motorman/vertices';
// import { Element, attr, watch, bind, handle } from '@motorman/vertices/core/decorators';
import { Element, observe, element, attr, listener, message } from '@motorman/vertices/core/decorators';
import { Sandbox } from '@motorman/vertices/sandbox';
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
    // template,
    // template: './modal.component.html',
    // lazy: !true,  // tells Vertices to expect a url
})
class ModalComponent {
    @observe('options') options: any = { };
    // @observe() get active(): boolean { return !this.requests.isEmpty(); }
    // protected requests: Queue<ModalRequest> = new Queue();
    // get request(): ModalRequest { return this.requests.front(); }
    get comm() { return this.$.comm; }
    test: string = 'this is some content';
    @element('this') modal: Element;
    @element('.id[data-test]') el: Element;
    @attr('this[data-test]') attr: Attr;
    
    type(e) {
        console.log('######', e, this);
        this.$.element.cycle();
    }
    
    @observe('options') handleOptionsChange(val, old) {
        console.log('@options-change', val, old);
    }
    
    // @listener('click') @element('this') handleSomeEvent(e: Event) {
    //     console.log('@ MODEL - LISTENER #this', e.type, e);
    // }
    // @listener('click') @element('.id[data-test]') handleSomeEvent(e: Event) {
    //     console.log('@ MODEL - LISTENER #.id[data-test]', e.type, e);
    // }
    // @listener('mutation') @attr('this[data-test]') handleSomeEvent(e: Event) {
    //     console.log('@ MODEL - LISTENER #this[data-test]', e.type, e);
    // }
    @listener('mutation') @attr('.id[data-test]') handleSomeEvent(e: Event) {
        console.log('@ MODEL - LISTENER #.id[data-test]', e.type, e);
    }
    
    constructor(private $: Sandbox) {
        // var { comm } = this;
        // comm.subscribe(comm.channels['ELEMENT:CREATED'], () => comm.publish(comm.channels['ELEMENT:TEMPLATE:FOUND'], template) );
        // $.in($.channels['MODAL:REQUESTED']).subscribe(this.handleRequest);
        // $.in($.channels['MODAL:DISMISSED']).subscribe(this.handleDismiss);
        // console.log('>->', this.modal, this.el);
        // setTimeout( () => console.log('>->', this.modal, this.el), (1000 * 1) );
        // setTimeout( () => console.log('>->', this.attr), (1000 * 1) );
        setTimeout( () => this.attr.addEventListener('change', () => console.log('GOT CHANGE'), false), (1000 * 1) );
    }
    
    // // @listener('this') handleClick(e: Event) {  // needs option for selector?
    // //     var { $, requests } = this;
    // //     console.log('@modal # click', e);
    // // }
    
    // handleClique(e, active, adHoc) {
    //     var { $, requests } = this;
    //     console.log('\n\n @event', e.type, active, adHoc, '\n\n');
    //     // requests.dequeue();
    //     // $.publish($.channels['BACKDROP:DISMISSED'], { test: true });
    // }
    
    @message('LEFECYCLE:ELEMENT:CREATED') onConnected = () => this.comm.publish(this.comm.channels['ELEMENT:TEMPLATE:FOUND'], template);
    @message('ELEMENT:MUTATION:OBSERVED') handleMutation(e: CustomEvent) {
        console.log('HANDLING MUTATION', e);
    }
    
    // private handleRequest = (e: CustomEvent) => {
    //     var { $, requests } = this;
    //     var { type, detail }: { type: string, detail: ModalRequest } = e;
    //     requests.enqueue(detail);
    //     $.publish($.channels['BACKDROP:REQUESTED'], { test: true });
    // };
    
    // private handleDismiss = (e: CustomEvent) => {
    //     var { $, requests } = this;
    //     var { type, detail } = e;
    //     console.log('@ ModalComponent', type, detail);
    //     requests.dequeue();
    // };
    
    
    
    
    ////////////////////////////////////////////////////////
    
    // @attr() options: any = { };
    // // @attr() get options() { return new Function(`return ${value};`); }
    // //         set options(value: string) { this.config = `${value}`; }
    // @attr() get active(): boolean { return !this.requests.isEmpty(); }
    // //         set active(value: boolean) {  }
    // //         set active(value: boolean) { if (!value) this.requests.dequeue(); }
    // protected requests: Queue<ModalRequest> = new Queue();
    // get request(): ModalRequest { return this.requests.front(); }
    // // @attr() ['onclick']: Function = () => {};
    // get comm() { return this.$.comm; }
    
    // constructor(private $: Sandbox) {
    //     var { comm } = this;
    //     // comm.subscribe(comm.channels['ELEMENT:CREATED'], () => comm.publish(comm.channels['ELEMENT:TEMPLATE:FOUND'], template) );
    //     $.in($.channels['MODAL:REQUESTED']).subscribe(this.handleRequest);
    //     $.in($.channels['MODAL:DISMISSED']).subscribe(this.handleDismiss);
    // }
    
    // @bind('click') handleClick(e: Event) {  // needs option for selector?
    //     var { $, requests } = this;
    //     console.log('@modal # click', e);
    // }
    
    // handleClique(e, active, adHoc) {
    //     var { $, requests } = this;
    //     console.log('\n\n @event', e.type, active, adHoc, '\n\n');
    //     // requests.dequeue();
    //     // $.publish($.channels['BACKDROP:DISMISSED'], { test: true });
    // }
    
    // @handle('LEFECYCLE:ELEMENT:CREATED') onConnected = () => this.comm.publish(this.comm.channels['ELEMENT:TEMPLATE:FOUND'], template);
    
    // private handleRequest = (e: CustomEvent) => {
    //     var { $, requests } = this;
    //     var { type, detail }: { type: string, detail: ModalRequest } = e;
    //     requests.enqueue(detail);
    //     $.publish($.channels['BACKDROP:REQUESTED'], { test: true });
    // };
    
    // private handleDismiss = (e: CustomEvent) => {
    //     var { $, requests } = this;
    //     var { type, detail } = e;
    //     console.log('@ ModalComponent', type, detail);
    //     requests.dequeue();
    // };
    
}

export { ModalComponent };
