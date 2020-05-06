
import { Queue } from '@motorman/core/utilities/ds';
import { ElementNode, trigger } from '@motorman/vertices/core/decorators';
import { NodeSandbox as Sandbox } from '@motorman/vertices/core';
import template from './modal.component.html';

class SingletonComponentRequest { constructor(options: any = {}) {} }  // MOCK/TEMP

class ModalRequest extends SingletonComponentRequest {
    id: string = '';
    content: string = '';  // <template id="selector">
    
    constructor(options: any = {}) {
        super(options);
        var { id, content } = options;
        
        this.id = id || this.id;
        this.content = content || this.content;
        
        return this;
    }
    
}

@ElementNode({ selector: 'v-modal' })
class ModalComponent {
    private requests: Queue<ModalRequest> = new Queue();
    get request(): ModalRequest { return this.requests.front(); };
    get active(): boolean { return !this.requests.isEmpty(); };
    get content(): string { return this.request && this.request.content || '...'; }
    
    constructor(private $: Sandbox) {
        $.in('MODAL:REQUESTED').subscribe(this.handleRequest);
        $.in('MODAL:DISMISSED').subscribe(this.handleDismiss);
        $.state.set(this);
        $.content.set(template);
    }
    
    handleClick(e: Event, x, y) {
        // console.log('MODAL', e.type, e.target, e.currentTarget, x, y);
        console.log('MODAL', e.type, x, y);
        return false;
    }
    
    private handleRequest = (e: CustomEvent) => {
        var { $, requests } = this;
        var { type, detail }: { type: string, detail: ModalRequest } = e;
        var request = new ModalRequest(detail);
        
        requests.enqueue(request);
        $.state.set(this);
        $.node.setAttribute('active', ''+this.active);
        $.publish('BACKDROP:REQUESTED', { test: true });
        console.log('@ ModalComponent', this.request);
    };
    
    private handleDismiss = (e: CustomEvent) => {
        var { $, requests } = this;
        var { type, detail } = e;
        
        console.log('@ ModalComponent', type, detail);
        requests.dequeue();
        $.state.set(this);
        $.node.setAttribute('active', ''+this.active);
        $.publish('BACKDROP:DISMISSED', { test: true });
    };
    
}

export { ModalComponent };
