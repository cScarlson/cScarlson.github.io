
const Metadata = function Metadata(options={}) {
    const { v, src, type, self, controller, slots, module, script, view, handler, selector, children, contents, model, attributes, interpolate } = { ...this, ...options };
    const thus = this;
    
    // export precepts
    this.v = v;
    this.src = src;
    this.type = type;
    this.self = self;
    this.controller = controller;
    this.slots = slots;
    this.module = module;
    this.script = script;
    this.view = view;
    this.handler = handler
    this.selector = selector;
    this.children = children;
    this.contents = contents;
    this.model = model;
    this.attributes = attributes;
    this.interpolate = interpolate;
    
    return this;
};

export { Metadata };
