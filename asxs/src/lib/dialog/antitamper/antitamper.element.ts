
import type { ToDo } from '@asxs/core/types';
import { customElement } from '@asxs/core';

const { log } = console;

export const TAGNAME = 'as-dialog-antitamper';
export @customElement(TAGNAME, { extends: 'dialog' }) class AntitamperDialogElement extends HTMLDialogElement {
    #parent!: Element;
    accepted: boolean = false;
    
    accept() {
        this.accepted = true;
    }
    
    connectedCallback() {
        const { parentElement } = this;
        this.#parent = parentElement as Element;
    }
    
    disconnectedCallback() {
        if (!this.accepted) this.#parent.appendChild(this);
    }
    
};
