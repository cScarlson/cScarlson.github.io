
const Metadata = function Metadata(options={}) {
    const { v, src, type, self, slots, module, script, selector, children, contents, instance, attributes } = { ...this, ...options };
    const thus = this;
    
    // export precepts
    this.v = v;
    this.src = src;
    this.type = type;
    this.self = self;
    this.slots = slots;
    this.module = module;
    this.script = script;
    this.selector = selector;
    this.children = children;
    this.contents = contents;
    this.instance = instance;
    this.attributes = attributes;
    
    return this;
};

export { Metadata };
