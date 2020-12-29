
import { utils } from './utilities';
import { EventManager } from './event.manager';

class Lifecycle {
    static $instances = new Map();
    utils = utils;
    Vertex = null;
    events = null;
    mutations = null;
    template = '';    // unfulfilled template
    reflection = '';  // fulfilled template
    selector = '';
    node = null;
    parent = null;
    instance = null;
    $injections = new Map();

    constructor(core, options) {
        var { Vertex } = core;
        var { selector, node, decorators, Module, mutations } = options;
        var { innerHTML, children, childNodes } = node;
        var { template } = Module;
        var instance = core.instantiate(node, ...decorators, Module);
        var parent = core.getAncestor(node.parentElement);
        
        this.Vertex = Vertex;
        this.node = node;
        this.instance = instance;
        this.template = template;
        this.parent = parent;
        this.events = new EventManager({ target: node });
        this.mutations = mutations;
        this.mutations.connect({});
        if (template) this.addSlot(...childNodes).cycle();
        this.mutations.subscribe('*', this.handleMutation);
        this.events.subscribe('*', this.handleEvent);

        return this;
    }

    addSlot(node?, ...more) {
        if ( !node ) return this;  // abort
        if ( !{ [Node.TEXT_NODE]: true, [Node.ELEMENT_NODE]: true }[ node.nodeType ] ) return this;  // abort if not text or element
        if (  { [Node.TEXT_NODE]: true }[ node.nodeType ] && { '\n': true, '\s': true,  }[ node.data ] ) return this;  // abort if text but lame
        var id = { [Node.ELEMENT_NODE]: (node.slot || ''), [Node.TEXT_NODE]: '' }[ node.nodeType ];  // all text and *:not[slot] or *[slot=""] goes to "default"
        
        if ( !this.$injections.has(id) ) this.$injections.set(id, []);
        this.$injections.get(id).push(node);

        if (more.length) this.addSlot(...more);
        return this;
    }

    cycle() {
        var { Vertex: V, utils, node, instance, template } = this;
        var html = utils.interpolate(template)(instance);
        
        this.mutations.disconnect();
        this.events.bind(template);
        this.template = template;
        this.render(html);
        this.mutations.connect({});
        V(node.firstChild);
    }

    render(html) {
        var { node } = this;
        var doc = new DocumentFragment();
        var template = document.createElement('template');
        var content = template.content;

        template.innerHTML = html;
        doc.appendChild(content);
        this.slot(doc).load(doc);

        return this;
    }

    slot(container) {
        var slots = container.querySelectorAll('slot');
        slots.forEach( (slot) => this.inject( slot, ...this.$injections.get(slot.name) ) );
        return this;
    }

    inject(slot, injection?, ...more) {
        if (!injection) return this;
        slot.appendChild( injection.cloneNode(true) );
        if (more.length) this.inject(slot, ...more);
        return this;
    }

    load(doc) {
        var { node } = this;
        var { childNodes: contents } = doc;
        
        while (node.lastChild) node.firstChild.remove();
        for (let i = 0, len = contents.length; i < len; i++) this.attach(node, contents[i]);
        
        return this;
    }

    attach(node, child) {
        var clone = child.cloneNode(true);
        document.importNode(clone, true);
        node.appendChild(clone);
        return this;
    }

    ['mutation:*'](mutation) {
        var { instance } = this;
        var { type } = mutation;
        var handler = `mutation:${type}`;
        
        this[handler](mutation);
        if (handler in instance) instance[handler](mutation);
    }

    ['mutation:attributes'](mutation) {
        var { instance, node } = this;
        var { attributeName: name, oldValue: old } = mutation;
        var current = node.getAttribute(name);
        var handler = `mutation:attributes:${name}`;
        
        if (handler in instance) instance[handler](current, old, mutation);
    }

    ['mutation:childList'](mutation) {
        var { addedNodes, removedNodes } = mutation;
        var additions = Array.prototype.slice.call(addedNodes);
        var removals = Array.prototype.slice.call(removedNodes);
        
        this['mutation:childList:removed'](mutation, ...removals);
        this['mutation:childList:added'](mutation, ...additions);
    }
    ['mutation:childList:added'](mutation, node?, ...more) {
        var { instance } = this, handler = 'mutation:childList:added';
        if (handler in instance) instance[handler](mutation, node, ...more);
    }
    ['mutation:childList:removed'](mutation, node?, ...more) {
        var { instance } = this, handler = 'mutation:childList:removed';
        if (handler in instance) instance[handler](mutation, node, ...more);
    }

    handleMutation = (e) => {
        var { type, detail: mutation } = e;
        var handler = `mutation:${type}`;
        this[handler](mutation);
    };

    handleEvent = (e) => {
        var { instance } = this;
        var { detail } = e;
        var { event, type, attr, delegate } = detail;
        
        delegate(instance);
    };

}

export { Lifecycle };
