
import { Queue } from '@motorman/core/utilities/ds';
import { NodeSandbox as Sandbox } from '@motorman/vertices/core';

import { ElementNode } from '@motorman/vertices/core/decorators';
// import { IElementSandbox } from '@app/core/sandbox';
import template from './hud.component.html';

type THUD = ''|'vattention'|'vmodal'|'vnote'|'valert'|'vconfirm'|'vprompt';

class SingletonComponentRequest { constructor(options: any = {}) {} }  // MOCK/TEMP

class HUDRequest extends SingletonComponentRequest {
    id: string = '';
    type: THUD = '';
    level: number = 0;  // (log-level for alerts & notes (likely not modals?))
    backdrop: boolean = false;
    content: string = '';  // <template id="selector">
    
    constructor(options: any = {}) {
        super(options);
        var { id, type, level, backdrop, content } = options;
        
        this.id = id || this.id;
        this.type = type || this.type;
        this.level = level || this.level;
        this.backdrop = backdrop || this.backdrop;
        this.content = content || this.content;
        
        return this;
    }
    
}

interface IHUDState {}

class BaseState implements IHUDState {
    
    init() {
        return this;
    }
    
    destroy() {
        return this;
    }
    
}

class AttentionState extends BaseState {}
class ModalState extends BaseState {}
class ToastState extends BaseState {}
class AlertState extends BaseState {}
class PromptState extends BaseState {}
class ConfirmState extends BaseState {}

var STATES = {
    'vattention': AttentionState,
    'vmodal': ModalState,
    'vnote': ToastState,
    'valert': AlertState,
    'vprompt': PromptState,
    'vconfirm': ConfirmState,
};

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
    get type(): THUD { return this.request ? this.request.type : ''; }
    get content(): string { return this.request ? this.request.content : '...'; }
    get state(): IHUDState { return new STATES[ this.type ](this.$); }
    
    constructor(private $: Sandbox) {
        // console.log('HUD', $);
        $.in('HUD:REQUESTED').subscribe(this.handleRequest);
        $.in('HUD:DISMISSED').subscribe(this.handleDismiss);
        $.state.set(this);
        $.content.set(template);
    }
    
    open(request: HUDRequest) {
        var { $, requests } = this;
        
        requests.enqueue(request);
        $.node.classList.add(this.request.type);
        $.state.set(this);
        $.node.setAttribute('active', ''+this.active);
        if (this.request.backdrop) $.publish('BACKDROP:REQUESTED', { test: true });  // keep synchronized
        else $.publish('BACKDROP:DISMISSED', { test: true });  // keep synchronized
        
        return this;
    }
    
    close() {
        var { $, requests } = this;
        var closed = requests.dequeue();
        var request = this.request;
        
        if (request) $.node.classList.add(request.type);
        $.node.classList.remove(closed.type);
        $.state.set(this);
        $.node.setAttribute('active', ''+this.active);
        if (request && request.backdrop) $.publish('BACKDROP:REQUESTED', { test: true });  // keep synchronized
        else $.publish('BACKDROP:DISMISSED', { test: true });  // keep synchronized
        
        return this;
    }
    
    handleClose(e: Event) {
        this.close();
        return false;
    }
    
    handleRecycle(e: Event, focum: HTMLElement) {
        focum.focus();
    }
    
    private handleRequest = (e: CustomEvent) => {
        var { detail }: { type: string, detail: HUDRequest } = e;
        var request = new HUDRequest(detail);
        this.open(request);
    };
    
    private handleDismiss = (e: CustomEvent) => {
        var { type, detail } = e;
        this.close();
    };
    
}

export { HUDComponent };
