
import type { ToDo } from '@asxs/core/types';
import { customElement } from '@asxs/core';
import { Queue } from '@asxs/core/utilities/patterns/ds/queue';

type Mode = 'show' | 'showModal';
type Type = '' | 'html' | 'node';
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
        // const data = queue.dequeue();
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
        log(`@DIALOG.CANCEL`, e, this.queue.size);
        e.preventDefault();
    }
    
    #handleClose(e: CloseEvent) {
        log(`@DIALOG.CLOSE`, e, this.queue.size);
        e.preventDefault();
    }
    
    #handleRequest(e: MessageEvent) {
        const { data: message } = e;
        const { mode } = message;
        log(`@REQUEST`, e.data);
        this[mode](message);
    }
    
    handleEvent(e: Event | CloseEvent | MessageEvent) {
        if (e.type === 'as:dialog:close') return this.#handleClose(e as CloseEvent);
        if (e.type === 'cancel') return this.#handleCloseRequest(e as CloseEvent);
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
