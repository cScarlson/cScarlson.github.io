
import { $, Queue } from '/developers/app/core.js';

const { log, error: err } = console;

class Handler {
    id = '';
    type = '';
    data = {};
    
    constructor(request = {}) {
        const { id, type, data } = { ...this, ...request };
        
        this.id = id;
        this.type = type;
        this.data = data;
        
        return this;
    }
    
}

class TemplateHandler extends Handler {
    template = '';
    
    constructor(request = {}) {
        super(request);
        const { template } = { ...this, ...request };
        
        this.template = template;
        
        return this;
    }
    
    execute(target) {
        const { type, template, data } = this;
        target.innerHTML = template;
    }
    
}

class NodeHandler extends Handler {
    node = '';
    
    constructor(request = {}) {
        super(request);
        const { node } = { ...this, ...request };
        
        this.node = node;
        
        return this;
    }
    
    execute(target) {
        const { type, node, data } = this;
    }
    
}

class MissingTypeHandler extends TemplateHandler {
    execute() {
        err(`Missing "type" in in request`);
        super.execute();
    }
}

$.set('dialog', 'close', 'cancel', class {
    queue = new Queue([ ]);
    types = { 'undefined': MissingTypeHandler, 'template': TemplateHandler, 'node': NodeHandler };
    dialog = document.createElement('dialog');
    content = document.createElement('div');
    
    constructor($) {
        const { target: host } = $;
        const content = host.querySelector('.modal.body .body.content');
        
        this.$ = $;
        this.dialog = host;
        this.content = content;
        
        $.subscribe('SIDELOAD:REQUEST', this);
        $.subscribe('SIDELOAD:DISMISS', this);
    }
    
    show() {
        if (this.dialog.open) return this;
        if (this.queue.front?.id === 'app:menu') this.dialog.showModal();
        else this.dialog.show();
        
        return this;
    }
    
    execute() {
        const { queue, types, dialog, content } = this;
        const { front: next } = queue;
        const { type, id } = next;
        const { [type]: Class } = types;
        const handler = new Class(next);
        
        handler.execute(content);
        this.show();
    }
    
    handleEvent(e) {
        if (e.type === 'SIDELOAD:REQUEST') return this.handleRequest(e);
        if (e.type === 'SIDELOAD:DISMISS') return this.handleDismiss(e);
        const { $ } = this;
        const { type, target } = e;
        const { className } = target;
        const action = `${type}:${className}`;
        const handle = {
            'close:sideload modal': this.handleClose,
        }[ action ];
        
        if (handle) handle.call(this, e);
        else log(`@Sideload.handleEvent`, e.type, e.target);
    }
    
    handleClose(e) {
        e.preventDefault();
        const { $, queue, dialog } = this;
        const request = queue.dequeue();
        
        $.publish('SIDELOAD:REQUEST:COMPLETE', request);
        if (!queue.empty) this.execute();
    }
    
    handleRequest(e) {
        const { queue } = this;
        const { data: request } = e;
        
        queue.enqueue(request);
        this.execute();
    }
    
    handleDismiss(e) {
        const { queue, dialog } = this;
        queue.clear();
        dialog.close();
    }
    
});
