
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
        var parent = parent || this;
        
        this.details = details;
        this.parent = parent;
        this.template = node;
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
        const isLoopInstruction = node.hasAttribute('...');
        const isLoopDerivative = node.matches('[v-reflect][v-index][v-alias]');
        
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
    clones = new Map();
    alias = '';
    key = '';
    instruction = '';
    
    constructor(options={}, parent) {
        super(options, parent);
        const { expression, node } = { ...this, ...options };
        const { attributes } = node;
        const { '...': attr } = attributes;
        const { value: instruction } = attr;
        const [ x, alias, key ] = expression.exec(instruction) || [ ];
        
        this.instruction = instruction;
        this.alias = alias;
        this.key = key;
        
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
        const { details, node, model, $children, alias, key, instruction } = this;
        const { [key]: collection } = model;
        const thus = this;
        
        class CloneScopeProxyHandler {  // todo: move this outta here!
            details = { };
            get model() { return this.details.model }
            
            constructor(details) {
                this.details = details;
            }
            
            get(target, key, receiver) {
                const { model } = this;
                const has = (key in target);
                
                if (has) return Reflect.get(target, key, receiver);
                return model[key];
            }
            
        }
        
        function scope(item, i) {
            const clone = node.cloneNode(true);
            const handler = new CloneScopeProxyHandler(details);
            const proxy = new Proxy({ [alias]: item }, handler);
            const data = { ...details, model: proxy };
            
            clone.removeAttribute('...');
            clone.setAttribute('v-reflect', `${instruction} (${i})`);
            // clone.setAttribute('v-reflect', key);  // these may be useless
            // clone.setAttribute('v-index', i);
            // clone.setAttribute('v-alias', alias);
            $children.set( clone, new VirtualNode({ details: data, node: clone }, thus) );  // set manually. create virtuant after removing *[...]
            
            return node.before(clone);
        }
        
        collection.forEach(scope);
        node.remove();
        
        return this;
    }
    
}

class VirtualElementInstructionDerivativeNode extends AbstractVirtualElementNode {
    
    constructor(options={}, parent) {
        super(options, parent);
        const { node } = { ...this, ...options };
        const reflect = node.getAttribute('v-reflect');
        const index = node.getAttribute('v-index');
        const alias = node.getAttribute('v-alias');
        
        // log(`@DERIVATIVE...`, reflect, index, alias, node, options.details.model);
        
        return this;
    }
    
    initialize() {
        const { model } = this;
        super.initialize(model);
        log(`@@@@@-DERIVATIVE-init`, model);
        return this;
    }
    
    notify(key) {
        const { model } = this;
        super.notify(key, model);
        log(`@@@@@-DERIVATIVE-notify`);
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
        const { template, node, data } = this;
        const variable = `$\{${key}\}`, re = `\\$\\{${key}\\}`;
        const exp = new RegExp(re, 'gm');
        const eligible = exp.test(data);
        
        if (eligible) node.data = utilities.interpolate(variable)(model);
        
        return this;
    }
    
}

class VirtualAttributeNode {
    
    constructor(options={}, owner) {
        const { node } = { ...this, ...options };
        const { name, value } = node;
        var owner = owner || this;
        // const types = {
        //     '...': VirtualAttributeRepeatNode,
        // };
        
        node.addEventListener('change', e => log(`@ttr#change`, e), true);
        
        // if (name in types) return new types[name](options, owner);  // catches recognized types
        if ( /^\[(.+)\]$/.test(name) ) return new VirtualAttributeBindingNode(options, owner);
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
    expression = /^\[(.+)\]$/;
    property = '';
    get bindable() { return this.expression.test(this.name) }
    
    constructor(options={}, owner) {
        super(options, owner);
        const { expression, node } = { ...this, ...options };
        const { name, value } = node;
        const [ x, property ] = expression.exec(name) || [ ];
        var owner = owner || this;
        
        this.property = property;
        
        return this;
    }
    
    initialize(model) {
        if (!this.bindable) return this;
        const { value, property } = this;
        
        this.notify(value, model);
        
        return this;
    }
    
    notify(key) {
        if (!this.bindable) return this;
        const { node, value, property, owner } = this;
        const { ownerElement } = node;
        const { model } = owner;
        const instruction = (owner instanceof VirtualElementInstructionNode);
        
        if (value !== key) return this;
        if (!instruction) (new Function('element', `element.${property} = this.${key};`)).call(model, ownerElement);
        
        return this;
    }
    
}

class VirtualAttributeRepeatNode extends AbstractVirtualAttributeNode {
    expression = /^(.+)\sof\s(.+)$/;
    alias = '';
    key = '';
    
    constructor(options={}, owner) {
        super(options, owner);
        const { details, expression, node } = { ...this, ...options };
        const { model } = details;
        const { name, value } = node;
        const [ x, alias, key ] = expression.exec(value) || [ ];
        
        this.alias = alias;
        this.key = key
        log(`@ttr(...)%O`, node, name, alias, key, details);
        
        return this;
    }
    
    initialize(model) {
        return this.notify(this.key, model);
    }
    
    notify(key, model) {
        if (key !== this.key) return this;
        const { name, alias, key: value, value: instruction, node, owner } = this;
        const { ownerElement: element } = node;
        const { [key]: collection } = model;
        const { parent } = owner;
        
        function clone(item, i) {
            const clone = element.cloneNode(true);
            
            clone.removeAttribute('...');
            clone.setAttribute('v-reflect', key);
            clone.setAttribute('v-index', i);
            clone.setAttribute('v-alias', alias);
            parent.setChild(clone);
            
            return element.before(clone);
        }
        
        collection.forEach(clone);
        element.remove();
        
        return this;
    }
    
}

export { VirtualNode };
