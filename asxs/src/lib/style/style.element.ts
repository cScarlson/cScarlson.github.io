
import type { ToDo } from '@asxs/core/types';
import { customElement } from '@asxs/core';
import { default as buttons } from '@asxs/button/button.element.css?raw';
import { default as tooltip } from '@asxs/tooltip/tooltip.element.css?raw';
import { default as popover } from '@asxs/popover/popover.element.css?raw';
import { default as dialogs } from '@asxs/dialog/dialog.element.css?raw';
import { default as toasts } from '@asxs/dialog/toast/toast.element.css?raw';
import { default as quickviews } from '@asxs/dialog/quickview/quickview.element.css?raw';

const { log } = console;
const targets = {
    buttons,
    tooltip,
    popover,
    dialogs: [ dialogs, toasts, quickviews ].join('\n'),
};

export const TAGNAME = 'as-css-import';
export @customElement(TAGNAME, { extends: 'style' }) class CSSImport extends HTMLStyleElement {
    
    constructor() {
        super();
        const { attributes } = this;
        const { target: attr } = attributes as ToDo;
        const { value: target } = attr;
        const { [target]: stylesheet } = targets as ToDo;
        
        this.innerHTML = stylesheet;
    }
    
};
