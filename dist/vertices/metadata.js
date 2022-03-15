
const Metadata = function Metadata(options={}) {
    const { v, src, type, self, slots, module, script, outlet, render, handler, template, selector, children, contents, instance, attributes, interpolate } = { ...this, ...options };
    const thus = this;
    
    // export precepts
    this.v = v;
    this.src = src;
    this.type = type;
    this.self = self;
    this.slots = slots;
    this.module = module;
    this.script = script;
    this.outlet = outlet;
    this.render = render;
    this.handler = handler
    this.template = template;
    this.selector = selector;
    this.children = children;
    this.contents = contents;
    this.instance = instance;
    this.attributes = attributes;
    this.interpolate = interpolate;
    
    return this;
};

export { Metadata };
