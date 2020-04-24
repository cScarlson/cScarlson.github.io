
import { Queue } from '@motorman/core/utilities/ds';
import { V } from '@motorman/vertices';
// import { Element, attr, watch, bind, handle } from '@motorman/vertices/core/decorators';
import { Element, observe, element, attr, listener, message } from '@motorman/vertices/core/decorators';
import { Sandbox } from '../../../../../app/core';
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

@Element({ selector: 'v-modal' })
class ModalComponent {
    active = 'YO!';
    items = [
        { id: 0 },
        { id: 1 },
        { id: 2 },
    ];
    key = 'type';
    getType(item) {
        console.log('@ VALUE!', this);
        return `checkbox-${item.id}`;
    }
    test = 'my test!!!';
    
    constructor(private $: Sandbox) {
        console.log(`@Element({ selector: 'v-modal' })`, $);
        // comm.subscribe(comm.channels['ELEMENT:CREATED'], () => comm.publish(comm.channels['ELEMENT:TEMPLATE:FOUND'], template) );
        // $.in($.channels['MODAL:REQUESTED']).subscribe(this.handleRequest);
        // $.in($.channels['MODAL:DISMISSED']).subscribe(this.handleDismiss);
        $.content.set(template);
        setTimeout( () => $.publish('OUTPUT', { key: 'data-poop', value: 'turdz' }), (1000 * 5) );
        // setTimeout( () => $.template.set('...loading...'), (1000 * 5) );
        // setTimeout( () => $.template.set(template), (1000 * 8) );
        setTimeout( () => this.test = 'your test???', (1000 * 5) );
    }
    
    handleClique(e: Event, x, y) {
        console.log('MODAL', e.type, x, y);
        return false;
    }
    
    // @message('LEFECYCLE:ELEMENT:CREATED') onConnected = () => this.comm.publish(this.comm.channels['ELEMENT:TEMPLATE:FOUND'], template);
    // @message('ELEMENT:MUTATION:OBSERVED') handleMutation(e: CustomEvent) {
    //     console.log('HANDLING MUTATION', e);
    // }
    
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
