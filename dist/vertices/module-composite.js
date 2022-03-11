
/**
 * name: Module Composite
 * intention:
 *      * Leverage a Tree to encapsulate parent-child relationships between specific types of DOM Nodes.
 *      * Register composite instances in a global, flat Map so that records are unique search/find functionality is O(1).
 *      * Only register an instance if it does not already exist so that no record gets overwritten.
 *      * Return an already-existing instance instead of a new instance from the constructor so that client code cannot duplicate records.
 * patterns: { The Composite Pattern, 'Quick Unique Tree', 'Pseudo Singlton' }
 */
 class ModuleComposite extends Map {
    static composites = new Map();
    parent = this;
    module = document.createElement('module');
    type = ''
    get children() { return [ ...this.values() ] }
    
    constructor(options={}, parent) {
        super();
        const { module, type } = { ...this, ...options };
        const has = this.born(module);
        var parent = parent || this;
        
        this.parent = parent;
        this.module = module;
        this.type = type;
        if (!has) ModuleComposite.composites.set(module, this);  // do not overwrite any existing instance.
        
        if (has) return ModuleComposite.composites.get(module);  // abort. return existing instance instead.
        return this;
    }
    
    born(target) {
        const { composites } = ModuleComposite;
        return composites.has(target);
    }
    
    find(target) {
        const { composites } = ModuleComposite;
        return composites.get(target);
    }
    
}

export { ModuleComposite };
