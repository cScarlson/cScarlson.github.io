
class Bootstrap {
    core = null;

    constructor() {}

    execute(core, node) {
        this.core = core;
        this.preserve(core).mount(node);
        return this;
    }

    preserve(core) {
        return this;
    }

    mount(node) {
        var { core } = this;
        var { firstChild, nextSibling } = node;

        if (firstChild) this.mount(firstChild);
        if (nextSibling) this.mount(nextSibling);
        
        if ( !{ [Node.ELEMENT_NODE]: true }[ node.nodeType ] ) return node;
        core.$components.forEach( (metadata, selector) => core.mount(metadata, node) );
        
        return node;
    }

}

export { Bootstrap };
