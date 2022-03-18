
import utilities from './utilities/utilities.js';

class VirtualNode {
    
    constructor(options={}, parent) {
        const { node } = { ...this, ...options };
        const { nodeType } = node;
        const Model = {
            [Node.ELEMENT_NODE]: VirtualElementNode,
            [Node.TEXT_NODE]: VirtualTextNode,
            [Node.ATTRIBUTE_NODE]: VirtualAttributeNode,
        }[ nodeType ];
        
        if (!Model) return this;
        return new Model(options, parent);
    }
    
}

class AbstractVirtualNode {
    details = { };
    parent = null;
    template = null;
    node = null;
    nodeType = -1;
    get v() { return this.details.v }
    get module() { return this.details.module }
    get selector() { return this.details.selector }
    
    constructor(options={}, parent) {
        const { details, node } = { ...this, ...options };
        const { nodeType } = node;
        var parent = parent || this;
        
        this.details = details;
        this.parent = parent;
        this.template = node;
        this.node = node;
        this.nodeType = nodeType;
        
        return this;
    }
    
    notify(key, instance) {
        return this;
    }
    
}

class VirtualElementNode extends AbstractVirtualNode {
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
        const view = new VirtualNode({ details, node: attr }, this);
        
        $attributes.set(name, view);
        if (more.length) return this.setAttr(...more);
        return attr;
    }
    
    setChild(node, ...more) {
        if (!node) return node;
        const { $children, details } = this;
        const view = new VirtualNode({ details, node }, this);
        
        $children.set(node, view);
        if (more.length) return this.setChild(...more);
        return node;
    }
    
    notify(key, instance) {
        const { children, attributes } = this;
        
        for (let attr of attributes) attr.notify(key, instance);
        for (let child of children) child.notify(key, instance);
        
        return this;
    }
    
}

class VirtualTextNode extends AbstractVirtualNode {
    data = '';
    
    constructor(options={}, parent) {
        super(options, parent);
        const { node } = { ...this, ...options };
        const { data } = node;
        
        this.data = data;
        
        return this;
    }
    
    notify(key, instance) {
        const { template, node, data } = this;
        const variable = `$\{${key}\}`, re = `\\$\\{${key}\\}`;
        const exp = new RegExp(re, 'gm');
        const eligible = exp.test(data);
        
        if (eligible) node.data = utilities.interpolate(variable)(instance);
        
        return this;
    }
    
}

class VirtualAttributeNode extends AbstractVirtualNode {
    owner = null;
    name = '';
    value = '';
    expression = /^\[(.+)\]$/;
    key = '';
    
    constructor(options={}, owner) {
        super(options);
        const { expression, node } = { ...this, ...options };
        const { name, value } = node;
        const [ x, key ] = expression.exec(name) || [ ];
        var owner = owner || this;
        
        this.owner = owner;
        this.name = name;
        this.value = value;
        this.key = key;
        
        return this;
    }
    
    notify(key, instance) {
        if ( !this.expression.test(this.name) ) return this;
        const { details, node, name, value, key: _key, selector, v } = this;
        const { ownerElement } = node;
        
        if (value !== key) return this;
        ownerElement[_key] = instance[key];
        if ( ownerElement.matches(selector) ) setTimeout(this.invokeObserver.bind(this, { key: _key, value, ownerElement, instance }), 100);
        
        return this;
    }
    
    invokeObserver({ key, value, ownerElement, instance: parent }) {
        const { v } = this;
        const { modules } = v;
        const instance = v.instances.get(ownerElement);
        const lifecycle = `watch:${key}`;
        const result = parent[value];
        
        if (lifecycle in instance) instance[lifecycle]({ key, value: result });
    }
    
}

export { VirtualNode };
