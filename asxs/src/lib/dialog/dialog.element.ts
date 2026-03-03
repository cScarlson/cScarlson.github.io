
import type { ToDo } from '@asxs/core/types';
import { customElement } from '@asxs/core';
import { Queue } from '@asxs/core/utilities/patterns/ds/queue';

type Mode = 'show' | 'showModal';
type Type = '' | 'string' | 'node';
type Content = string | Node;

interface Queueable {
    mode: Mode;
    type: Type;
    header: Content;
    content: Content;
    footer: Content;
}

const { log } = console;
const DEFAULT_MESSAGE: Queueable = { type: '' } as ToDo;

export const TAGNAME = 'as-dialog-queue';
export @customElement(TAGNAME, { extends: 'dialog' }) class DialogElement extends HTMLDialogElement {
    queue: Queue<Queueable> = new Queue();
    
    #show(method: 'show' | 'showModal') {
        const { queue } = this;
        const { front: request } = queue;
        const { type, header, content, footer } = request;
        
        log(`#show@FRONT`, request);
        if (type === 'string') this.innerHTML = `${header}${content}${footer}`;
        super[method]();
    }
    
    show(message: Queueable = DEFAULT_MESSAGE) {
        const { queue } = this;
        if (message !== DEFAULT_MESSAGE) queue.enqueue(message);
        this.#show('show');
    }
    
    showModal(message: Queueable = DEFAULT_MESSAGE) {
        const { queue } = this;
        if (message !== DEFAULT_MESSAGE) queue.enqueue(message);
        this.#show('showModal');
    }
    
    #handleCloseRequest(e: CloseEvent) {
        const { queue } = this;
        queue.dequeue();
        log(`@DIALOG.REQUEST.CLOSE`, this.queue.size, e.type);
        if (!queue.size) this.close();
        else this.#show('showModal');
    }
    
    #handleCancel(e: CloseEvent) {
        const { queue } = this;
        queue.dequeue();
        log(`@DIALOG.CANCEL`, this.queue.size, e.type);
        if (!queue.size) return;
        e.preventDefault();
        this.#show('showModal');
    }
    
    #handleClose(e: CloseEvent) {
        this.queue.clear();
        log(`@DIALOG.CLOSE`, this.queue.size, e.type);
    }
    
    #handleRequest(e: MessageEvent) {
        const { data: message } = e;
        const { mode } = message;
        log(`@REQUEST`, this.queue.size, e.data);
        this[mode](message);
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
