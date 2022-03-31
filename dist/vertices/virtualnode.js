
import { CloneScopeProxyHandler } from './proxy.js';
import utilities from './utilities/utilities.js';

const { log, warn, error } = console;

/**
 * @name: Virtual Node
 * @patterns: { The State Pattern / The Abstract Factory Pattern }
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
        const { expression, node, start, end } = { ...this, ...options };
        const { attributes } = node;
        const { '+': attr } = attributes;
        const { name, value: instruction } = attr;
        const [ x, alias, key ] = expression.exec(instruction) || [ ];
        
        start.data = `(v: ${name}="${instruction}" start)`;
        end.data = `(v: ${name}="${instruction}" end)`;
        this.instruction = instruction;
        this.alias = alias;
        this.key = key;
        node.after(start);
        start.after(end);
        node.remove();
        
        return this;
    }
    
    initialize(data) {
        const { key, model, $children } = this;
        const { [key]: collection } = model;
        
        $children.clear();
        this.clone(collection);
        super.initialize(data);
        
        return this;
    }
    
    notify(data) {
        this.remodel(data);
        super.notify(data);
        return this;
    }
    
    remodel(data) {
        if ( !(data.target instanceof Array) && !(data.value instanceof Array) ) return this;  // only interested in scenarios involving arrays as the target or value.
        const { key, model, children } = this;
        const { key: property } = data;
        const { [key]: collection } = model;
        
        function redact(property, thus, child, i) {
            if (i != property) return thus;
            const { model, key } = this;
            const { [key]: collection } = model;
            const { [i]: item } = collection;
            const scope = this.scope(item);
            
            child.remodel(scope);
            return this;
        }
        
        if (property !== key && property !== 'length') return children.reduce( redact.bind(this, property), this );
        else return this.equalize(collection);
    }
    
    equalize(collection) {
        const { $children, children } = this;
        
        while ($children.size > collection.length) this.delete( children[children.length - 1] );
        while ($children.size < collection.length) this.clone( collection.slice($children.size, collection.length) );
        
        return this;
    }
    
    delete(child) {
        const { $children } = this;
        const { node } = child;
        
        $children.delete(node);
        node.remove();
    }
    
    clone(collection) {
        
        function attach(item, index) {
            const { details, template, $children, alias, key, end } = this;
            const clone = template.cloneNode(true);
            const proxy = this.scope(item);
            const data = { ...details, model: proxy };
            
            clone.removeAttribute('+');
            clone.setAttribute('v-index', `${index}`);
            end.before(clone);
            $children.set( clone, new VirtualNode({ details: data, node: clone, alias, key, collection, index, derivative: true }, this) );  // set manually. create virtuant after removing *[...]
            $children.get(clone).initialize({ model: proxy });
        }
        
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
        const { alias, key, index, collection } = { ...this, ...options };
        
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
    
    notify(data) {
        const { template, node } = this;
        const { model } = data;
        const { data: text } = template;
        
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
        const { node } = { ...this, ...options };
        const { value: instruction } = node;
        const [ property, namespace ] = instruction.split(':');
        var owner = owner || this;
        
        this.property = property;
        this.namespace = namespace;
        
        return this;
    }
    
    initialize(data) {
        const { namespace } = this;
        this.notify({ ...data, key: namespace });
        return this;
    }
    
    notify(data) {
        const { node, property, namespace, owner } = this;
        const { ownerElement } = node;
        const { model } = owner;
        const instruction = (owner instanceof VirtualElementInstructionNode);
        
        if (!instruction) (new Function('element', `element.${property} = this.${namespace}`)).call(model, ownerElement);
        
        return this;
    }
    
}

export { VirtualNode };
