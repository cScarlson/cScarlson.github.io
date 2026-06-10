
import type { ToDo } from '@asxs/core/types';
import { customElement } from '@asxs/core';
import { Queue } from '@asxs/core/utilities/patterns/ds/queue';

type Type = '' | 'string' | 'node';
type Content = string | Node[];

interface Queueable {
    type: Type;
    content: Content;
}

const { log } = console;
const DEFAULT_MESSAGE: Queueable = { type: '' } as ToDo;

export const TAGNAME = 'as-dialog-queue';
export @customElement(TAGNAME, { extends: 'dialog' }) class DialogElement extends HTMLDialogElement {
    queue: Queue<Queueable> = new Queue();
    
    #show() {
        const { queue } = this;
        const { front: request } = queue;
        const { type, content } = request;
        
        if (type === 'string') this.innerHTML = content as string;
        else this.#replace(...content as Node[]);
        super.showModal();
    }
    
    #replace(...nodes: Node[]) {
        this.innerHTML = '';
        this.append(...nodes);
    }
    
    showModal(message: Queueable = DEFAULT_MESSAGE) {
        const { queue } = this;
        if (message !== DEFAULT_MESSAGE) queue.enqueue(message);
        this.#show();
    }
    
    #handleCloseRequest(e: CloseEvent) {
        const { queue } = this;
        
        queue.dequeue();
        if (!queue.size) this.close();
        else this.#show();
    }
    
    #handleCancel(e: CloseEvent) {
        const { queue } = this;
        
        queue.dequeue();
        if (!queue.size) return;
        e.preventDefault();
        this.#show();
    }
    
    #handleClose(e: CloseEvent) {
        this.queue.clear();
    }
    
    #handleRequest(e: MessageEvent) {
        const { data: message } = e;
        this.showModal(message);
    }
    
    handleEvent(e: Event | CloseEvent | MessageEvent) {
        if (e.type === 'as:dialog:close') return this.#handleCloseRequest(e as CloseEvent);
        if (e.type === 'cancel') return this.#handleCancel(e as CloseEvent);
        if (e.type === 'close') return this.#handleClose(e as CloseEvent);
        if (e.type === 'as:dialog:request') return this.#handleRequest(e as MessageEvent);
    }
    
    connectedCallback() {
        this.addEventListener('as:dialog:close', this as ToDo, true);
        this.addEventListener('cancel', this as ToDo, true);
        this.addEventListener('close', this as ToDo, true);
        this.addEventListener('as:dialog:request', this, true);
    }
    
    disconnectedCallback() {
        this.removeEventListener('as:dialog:close', this as ToDo, true);
        this.removeEventListener('cancel', this as ToDo, true);
        this.removeEventListener('close', this as ToDo, true);
        this.removeEventListener('as:dialog:request', this, true);
    }
    
};
