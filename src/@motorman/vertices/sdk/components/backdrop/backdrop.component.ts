
import { Queue } from '@motorman/core/utilities/ds';
import { ElementNode } from '@motorman/vertices';
import { NodeSandbox as Sandbox } from '@motorman/vertices/core';

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

@ElementNode({ selector: 'v-backdrop' })
export class BackdropComponent {
    private requests: Queue<BackdropRequest> = new Queue();
    get request(): BackdropRequest { return this.requests.front(); };
    get active(): boolean { return !this.requests.isEmpty(); };
    
    constructor(private $: Sandbox) {
        $.in('BACKDROP:REQUESTED').subscribe(this.handleRequest);
        $.in('BACKDROP:DISMISSED').subscribe(this.handleDismiss);
        $.state.set(this);
    }
    
    handleInteraction(e: MouseEvent) {
        var { $, request } = this;
        $.publish('BACKDROP:INSPECTED', request);
    }
    
    private handleRequest = (e: CustomEvent) => {
        var { $, requests } = this;
        var { type, detail }: { type: string, detail: BackdropRequest } = e;
        var request = new BackdropRequest(detail);
        
        console.log('@ BackdropComponent', type, detail);
        requests.enqueue(request);
        $.state.set(this);
        $.node.setAttribute('active', ''+this.active);
    };
    
    private handleDismiss = (e: CustomEvent) => {
        var { $, requests } = this;
        var { type, detail } = e;
        
        console.log('@ BackdropComponent', type, detail);
        requests.dequeue();
        $.state.set(this);
        $.node.setAttribute('active', ''+this.active);
    };
    
}
