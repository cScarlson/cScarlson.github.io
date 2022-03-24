
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
    
    initialize(model) {
        return this;
    }
    
    notify(key, model) {
        return this;
    }
    
}

class VirtualElementNode extends AbstractVirtualNode {
    
    constructor(options={}, parent) {
        super(options, parent);
        const { node } = { ...this, ...options };
        const isLoopInstruction = node.hasAttribute('+');
        const isLoopDerivative = node.matches('[v-reflect]');
        
        if (isLoopInstruction) return new VirtualElementInstructionNode(options, parent);
        if (isLoopDerivative) return new VirtualElementInstructionDerivativeNode(options, parent);
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
    
    initialize(model) {
        const { children, attributes } = this;
        
        for (let attr of attributes) attr.initialize(model);
        for (let child of children) child.initialize(model);
        
        return this;
    }
    
    notify(key, model) {
        const { children, attributes } = this;
        
        for (let attr of attributes) attr.notify(key, model);
        for (let child of children) child.notify(key, model);
        
        return this;
    }
    
}

class VirtualElementInstructionNode extends AbstractVirtualElementNode {
    expression = /^(.+)\sof\s(.+)$/;
    position = document.createComment('');
    clones = new Set();
    alias = '';
    key = '';
    instruction = '';
    
    constructor(options={}, parent) {
        super(options, parent);
        const { expression, node, position } = { ...this, ...options };
        const { attributes } = node;
        const { '+': attr } = attributes;
        const { name, value: instruction } = attr;
        const [ x, alias, key ] = expression.exec(instruction) || [ ];
        const comment = `v: ${name}="${instruction}"`;
        
        position.data = comment;
        this.instruction = instruction;
        this.alias = alias;
        this.key = key;
        node.after(position);
        
        return this;
    }
    
    initialize(model) {
        this.clone();
        super.initialize(model);
        return this;
    }
    
    notify(key, model) {
        this.clone();
        super.notify(key, model);
        return this;
    }
    
    clone() {
        const { details, node, model, $children, alias, key, instruction, position } = this;
        const { [key]: collection } = model;
        const thus = this;
        
        function scope(item, i) {
            const clone = node.cloneNode(true);
            const scope = { [alias]: item };
            const handler = new CloneScopeProxyHandler(details);
            const proxy = new Proxy(scope, handler);
            const data = { ...details, model: proxy };
            
            clone.removeAttribute('+');
            clone.setAttribute('v-reflect', `${instruction} (${i})`);
            position.before(clone);
            $children.set( clone, new VirtualNode({ details: data, node: clone }, thus) );  // set manually. create virtuant after removing *[...]
            $children.get(clone).initialize(proxy);
        }
        
        $children.forEach( ({ node }) => node.remove() );
        collection.forEach(scope);
        node.remove();
        
        return this;
    }
    
}

class VirtualElementInstructionDerivativeNode extends AbstractVirtualElementNode {
    
    constructor(options={}, parent) {
        super(options, parent);
        const { node } = { ...this, ...options };
        return this;
    }
    
    initialize() {
        const { model } = this;
        super.initialize(model);
        return this;
    }
    
    notify(key) {
        const { model } = this;
        super.notify(key, model);
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
    
    initialize(model) {
        const { expression, data } = this;
        const variables = (data.match(expression) || []).map( placeholder => placeholder.replace(/[${}]/g, '') );
        
        if (!variables.length) return this;
        for (let key of variables) this.notify(key, model);
        
        return this;
    }
    
    notify(key, model) {
        const { template, node } = this;
        const { data } = template;
        
        node.data = utilities.interpolate(data)(model);
        
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
    
    notify(key, model) {
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
    
    initialize(model) {
        const { property, namespace } = this;
        this.notify(namespace, model);
        return this;
    }
    
    notify(key) {
        const { node, property, namespace, owner } = this;
        const { ownerElement } = node;
        const { model } = owner;
        const has = !~namespace.indexOf(key);
        const instruction = (owner instanceof VirtualElementInstructionNode);
        
        if (namespace !== key && has) return this;
        if (!instruction) (new Function('element', `element.${property} = this.${namespace};`)).call(model, ownerElement);
        
        return this;
    }
    
}

export { VirtualNode };
