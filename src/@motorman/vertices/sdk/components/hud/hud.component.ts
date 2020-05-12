
import { Queue } from '@motorman/core/utilities/ds';
import { NodeSandbox as Sandbox } from '@motorman/vertices/core';

import { ElementNode } from '@motorman/vertices/core/decorators';
// import { IElementSandbox } from '@app/core/sandbox';
import template from './hud.component.html';

class SingletonComponentRequest { constructor(options: any = {}) {} }  // MOCK/TEMP

class HUDRequest extends SingletonComponentRequest {
    id: string = '';
    type: 'alert'|'modal'|'note' = 'alert';
    level: number = 0;  // (log-level for alerts & notes (likely not modals?))
    backdrop: boolean = true;
    content: string = '';  // <template id="selector">
    
    constructor(options: any = {}) {
        super(options);
        var { id, type = 'alert', content } = options;
        
        this.id = id || this.id;
        this.type = type || this.type;
        this.content = content || this.content;
        
        return this;
    }
    
}

interface IHUDState {}

class AlertState implements IHUDState {}
class ModalState implements IHUDState {}
class ToastState implements IHUDState {}

@ElementNode({ selector: 'app-hud' })
/**
 * @NOTE
 *  HUD (Heads-Up Display) should be an abstract component for which types Modal (.modal), Note (.note), Alert (.alert) and other types
 *  can be provided to the HUD Component (as a Service) to demarcate various behaviors (not limited to position). For example:
 *  *   new HUDRequest({ ..., type: 'alert' }): Applies .alert (with position: relative) to push main/body down
 *  *   new HUDRequest({ ..., type: 'modal' }): Applies .modal (with position: absolute and BackdropRequest) across full main/body
 *  *   new HUDRequest({ ..., type: 'note' }): Applies .toast (with position: absolute w/o BackdropRequest) as toast
 *  Note that Bootstrap contains classes which may introduce conflicts. Synonyms for each are shown below:
 *  *   .modal: .vmodal, .process, .operation, ...
 *  *   .note: .toast, .info, .notification,
 *  *   .alert: .attention, .warning, ...
 *  Note that The State Pattern is an excellent solution to this problem:
 *  *   class HUDContext { state: IHUDState = new AlertState() }
 *  *   class AlertState {...} (default)
 *  *   class ModalState {...}
 *  *   class ToastState {...}
 */
class HUDComponent {
    private requests: Queue<HUDRequest> = new Queue();
    get request(): HUDRequest { return this.requests.front(); }
    get active(): boolean { return !this.requests.isEmpty(); }
    get type(): string { return this.request ? this.request.type : 'alert'; }
    get content(): string { return this.request ? this.request.content : '...'; }
    get state(): IHUDState { return { 'alert': AlertState, 'modal': ModalState, 'note': ToastState }[ this.type ] }
    
    constructor(private $: Sandbox) {
        // console.log('HUD', $);
        $.in('HUD:REQUESTED').subscribe(this.handleRequest);
        $.in('HUD:DISMISSED').subscribe(this.handleDismiss);
        $.state.set(this);
        $.content.set(template);
        // setTimeout( () => $.target.setAttribute('active', 'true'), (1000 * 3) );
    }
    
    handleClick(e: Event, x, y) {
        // console.log('HUD', e.type, e.target, e.currentTarget, x, y);
        console.log('HUD', e.type, x, y);
        return false;
    }
    
    private handleRequest = (e: CustomEvent) => {
        var { $, requests } = this;
        var { detail }: { type: string, detail: HUDRequest } = e;
        var current = requests.front();
        var request = new HUDRequest(detail);
        
        requests.enqueue(request);
        if (current) $.node.classList.remove(current.type);
        $.node.classList.add(request.type);
        $.state.set(this);
        $.node.setAttribute('active', ''+this.active);
        if (request.backdrop) $.publish('BACKDROP:REQUESTED', { test: true });  // keep synchronized
        console.log('@ ModalComponent', this.request);
    };
    
    private handleDismiss = (e: CustomEvent) => {
        var { $, requests } = this;
        var { type, detail } = e;
        var request = requests.dequeue();
        
        console.log('@ ModalComponent', type, detail);
        $.state.set(this);
        $.node.classList.add(request.type);
        $.node.setAttribute('active', ''+this.active);
        if (request.backdrop) $.publish('BACKDROP:DISMISSED', { test: true });  // keep synchronized
    };
    
}

export { HUDComponent };
