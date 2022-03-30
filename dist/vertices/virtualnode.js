
import { CloneScopeProxyHandler } from './proxy.js';
import utilities from './utilities/utilities.js';

const { log, warn, error } = console;

/**
 * @name: Virtual Node
 * @patterns: { The State Pattern }
 */
class VirtualNode {
    
    constructor(options={}, parent) {
        const { node } = { ...this, ...options };
        const { nodeType } = node;
        const Model = {
            [Node.ELEMENT_NODE]: VirtualElementNode,
            [Node.TEXT_NODE]: VirtualTextNode,
            [Node.ATTRIBUTE_NODE]: VirtualAttributeNode,
        }[ nodeType ];
        
        if (Model) return new Model(options, parent);
        return this;
    }
    
}

class AbstractVirtualNode {
    details = { };
    parent = null;
    template = null;
    node = null;
    nodeType = -1;
    get v() { return this.details.v }
    get model() { return this.details.model }
    get module() { return this.details.module }
    get selector() { return this.details.selector }
    
    constructor(options={}, parent) {
        const { details, node } = { ...this, ...options };
        const { nodeType } = node;
        const clone = node.cloneNode(true);
        var parent = parent || this;
        
        this.details = details;
        this.parent = parent;
        this.template = clone;
        this.node = node;
        this.nodeType = nodeType;
        
        return this;
    }
    
    initialize({ model }) {
        return this;
    }
    
    notify({ target, key, value, model, details }) {
        return this;
    }
    
}

class VirtualElementNode extends AbstractVirtualNode {
    
    constructor(options={}, parent) {
        super(options, parent);
        const { node, derivative } = { ...this, ...options };
        const instructive = node.hasAttribute('+');
        
        if (instructive) return new VirtualElementInstructionNode(options, parent);
        if (derivative) return new VirtualElementInstructionDerivativeNode(options, parent);
        return new AbstractVirtualElementNode(options, parent);
    }
    
}

class AbstractVirtualElementNode extends AbstractVirtualNode {
    tagName = 'NONE';
    $attributes = new Map();
    $children = new Map();
    get attributes() { return Array.from( this.$attributes.values() ) }
    get children() { return Array.from( this.$children.values() ) }
    
    constructor(options={}, parent) {
        super(options, parent);
        const { node } = { ...this, ...options };
        const { tagName, attributes, childNodes } = node;
        
        this.tagName = tagName;
        this.setAttr(...attributes);
        this.setChild(...childNodes);
        
        return this;
    }
    
    setAttr(attr, ...more) {
        if (!attr) return attr;
        const { $attributes, details } = this;
        const { name } = attr;
        const controller = new VirtualNode({ details, node: attr }, this);
        
        $attributes.set(name, controller);
        if (more.length) return this.setAttr(...more);
        return attr;
    }
    
    setChild(node, ...more) {
        if (!node) return node;
        const { $children, details } = this;
        const controller = new VirtualNode({ details, node }, this);
        
        $children.set(node, controller);
        if (more.length) return this.setChild(...more);
        return node;
    }
    
    initialize({ model }) {
        const { children, attributes } = this;
        
        for (let attr of attributes) attr.initialize({ model });
        for (let child of children) child.initialize({ model });
        
        return this;
    }
    
    notify({ target, key, value, model, details }) {
        const { children, attributes } = this;
        
        for (let attr of attributes) attr.notify({ target, key, value, model, details });
        for (let child of children) child.notify({ target, key, value, model, details });
        
        return this;
    }
    
}

class VirtualElementInstructionNode extends AbstractVirtualElementNode {
    expression = /^(.+)\sof\s(.+)$/;
    start = document.createComment('');
    end = document.createComment('');
    clones = new Set();
    alias = '';
    key = '';
    instruction = '';
    
    constructor(options={}, parent) {
        super(options, parent);
        const { expression, node, start } = { ...this, ...options };
        const { attributes } = node;
        const { '+': attr } = attributes;
        const { name, value: instruction } = attr;
        const [ x, alias, key ] = expression.exec(instruction) || [ ];
        const comment = `v: ${name}="${instruction}"`;
        
        start.data = comment;
        this.instruction = instruction;
        this.alias = alias;
        this.key = key;
        node.after(start);
        node.remove();
        
        return this;
    }
    
    initialize(data) {
        this.clone(data);
        super.initialize(data);
        return this;
    }
    
    notify(data) {
        this.remodel(data);
        super.notify(data);
        return this;
    }
    
    remodel(data) {
        if (data.key === 'length') return log(`remodel #key`, this.model[this.key].length, this.$children.size);
        
        function resolve(child, i) {
            if (i != data.key) return log(`dismissing`, i, data.key);
            const { model, key } = this;
            const { [key]: collection } = model;
            const { [i]: item } = collection;
            const scope = this.scope(item);
            
            child.remodel(scope);
        }
        
        this.children.forEach( resolve.bind(this) );
        
        return this;
    }
    
    clone(data) {
        const { model, $children, key } = this;
        const { [key]: collection } = model;
        
        function attach(item, index) {
            const { details, template, $children, alias, key, start } = this;
            const clone = template.cloneNode(true);
            const proxy = this.scope(item);
            const data = { ...details, model: proxy };
            
            clone.removeAttribute('+');
            clone.setAttribute('v-index', `${index}`);
            start.before(clone);
            $children.set( clone, new VirtualNode({ details: data, node: clone, alias, key, collection, index, derivative: true }, this) );  // set manually. create virtuant after removing *[...]
            $children.get(clone).initialize({ model: proxy });
        }
        
        $children.clear();
        collection.forEach( attach.bind(this) );
        
        return this;
    }
    
    scope(item) {
        const { details, alias } = this;
        const scope = { [alias]: item };
        const handler = new CloneScopeProxyHandler(details);
        const proxy = new Proxy(scope, handler);
        
        return proxy;
    }
    
}

class VirtualElementInstructionDerivativeNode extends AbstractVirtualElementNode {
    alias = '';
    key = '';
    index = -1;
    collection = [ ];
    
    constructor(options={}, parent) {
        super(options, parent);
        const { node, alias, key, index, collection } = { ...this, ...options };
        
        this.alias = alias;
        this.key = key;
        this.index = index;
        this.collection = collection;
        
        return this;
    }
    
    initialize(data) {
        const { model } = this;
        super.initialize({ model });
        return this;
    }
    
    remodel(model) {
        this.details.model = model;
        super.notify({ model });
        return this;
    }
    
    notifyX(data) {
        if (data.key === 'length') return this;
        const { model, index } = this;
        const { key } = data;
        
        if (data.target instanceof Array && data.key == this.index) super.notify({ ...data, model: { [this.alias]: this.collection[key] } }, 'test');
        else super.notify({ ...data, model });
        
        return this;
    }
    
}

class VirtualTextNode extends AbstractVirtualNode {
    expression = /\$\{(.+?)\}/gm;
    data = '';
    
    constructor(options={}, parent) {
        super(options, parent);
        const { node } = { ...this, ...options };
        const { data } = node;
        
        this.data = data;
        
        return this;
    }
    
    initialize(data) {
        const { expression, data: text } = this;
        const variables = (text.match(expression) || []).map( placeholder => placeholder.replace(/[${}]/g, '') );
        
        if (!variables.length) return this;
        for (let key of variables) this.notify({ ...data, key });
        
        return this;
    }
    
    notify(data, test) {
        const { template, node } = this;
        const { model } = data;
        const { data: text } = template;
        if (test) log(`TEXT`, test, model, node);
        node.data = utilities.interpolate(text)(model);
        
        return this;
    }
    
}

class VirtualAttributeNode {
    
    constructor(options={}, owner) {
        const { node } = { ...this, ...options };
        const { name, value } = node;
        var owner = owner || this;
        const Model = {
            '.': VirtualAttributeBindingNode,
        }[ name ];
        
        node.addEventListener('change', e => log(`@ttr#change`, e), true);
        
        if (Model) return new Model(options, owner);  // catches recognized types
        return new AbstractVirtualAttributeNode(options, owner);
    }
    
}

class AbstractVirtualAttributeNode extends AbstractVirtualNode {
    owner = null;
    name = '';
    value = '';
    key = '';
    
    constructor(options={}, owner) {
        super(options);
        const { node } = { ...this, ...options };
        const { name, value } = node;
        var owner = owner || this;
        
        this.owner = owner;
        this.name = name;
        this.value = value;
        node.addEventListener('change', e => log(`@ttr#change`, e), true);
        
        return this;
    }
    
    notify(data) {  // todo: delete me?
        return this;
    }
    
}

class VirtualAttributeBindingNode extends AbstractVirtualAttributeNode {
    property = '';
    namespace = '';
    
    constructor(options={}, owner) {
        super(options, owner);
        const { expression, node } = { ...this, ...options };
        const { name, value: instruction } = node;
        const [ property, namespace ] = instruction.split(':');
        var owner = owner || this;
        
        this.property = property;
        this.namespace = namespace;
        
        return this;
    }
    
    initialize(data) {
        const { property, namespace } = this;
        this.notify({ ...data, key: namespace });
        return this;
    }
    
    notify(data) {
        const { node, property, namespace, owner } = this;
        const { key } = data;
        const { ownerElement } = node;
        const { model } = owner;
        const has = !!~namespace.indexOf(key);
        const instruction = (owner instanceof VirtualElementInstructionNode);
        const derivative = (owner instanceof VirtualElementInstructionDerivativeNode);
        
        if (!instruction) (new Function('element', `element.${property} = this.${namespace}`)).call(owner.model, ownerElement);
        // if (derivative) (new Function('element', `element.${property} = this.${namespace}; console.log("---->", element.${property}, this)`)).call(data.model, ownerElement);
        
        return this;
    }
    
}

export { VirtualNode };
