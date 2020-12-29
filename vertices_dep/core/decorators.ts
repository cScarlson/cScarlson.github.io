
/*

Decorators

Class decorators should always contain a "meta" property (on their descriptor, Class, or [root] Prototype) with a "members" object.
Member decorators always assign metadata to a "meta" object on their Class under members[key] providing data for their purpose.
Decorators should have the capability to be leveraged compositively with each other, adding "meta" data to the descriptor.

@observee('prop') x: any;  // prepares metadata for observableAttributes (of "prop" with alias "x")
@observer('prop') handleChange(...?) {}  // prepares metadata for handler called from attributedChangedCallback
@element('tagName.class[attr]') element: HTMLElement;  // prepares metadata to select & bind an element to component['element'] (if not arguments.length then return HostElement or FirstChild or querySelector('*') or descriptor.name)
@attr('tagName.class[attr]') attr: Attr;  // prepares metadata to select & bind an element's attribute-node to component['attr'] (if not "[attr]" then return descriptor.name)
@listener('click') handleClick() {}  // prepares metadata to handle "click" on HostElement
----
@listener('click') @element('tagName.class[attr]') handleClick({ target }) {}  // prepares metadata to handle "click" on metadata.selector of type "element"
@listener('change') @attr('tagName.class[attr]') handleChange({ ownerElement }) {}  // prepares metadata to handle "change" on metadata.selector of type "attr"

*/


type ObserveeMetadata = {
    decorator: 'attribute:observee',
    name: string,
    alias: string,
    hasGet: boolean,
    hasSet: boolean,
    hasGetOrSet: boolean,
    hasGetAndSet: boolean,
};
type ObserverMetadata = {
    decorator: 'attribute:observer',
    name: string,
    attr: string,
    handler: (...splat: any[]) => any,
};
interface ElementRefMetadata {
    decorator: 'reference:element';
    name: string;
    key: string;
    selector: string;
    isHost: boolean;
};
interface AttrRefMetadata {
    decorator: 'reference:attribute';
    name: string;
    key: string;
    selector: string;
    isHost: boolean;
};
type ListenerMetadata = {
    decorator: 'handler:dom',
    name: string,
    key: string,
    type: string,
    handler: (...splat: any[]) => any,
    isHost: boolean;
};
type CommMetadata = {
    decorator: 'handler:comm',
    name: string,
    key: string,
    type: string,
    handler: (...splat: any[]) => any,
};

class Metadata {  // TODO: create types for maps
    public $members: Map<string, any> = new Map();
    public $observedAttributes: Map<string, any> = new Map();
    public $watchers: Map<string, any> = new Map();
    public $elements: Map<string, any> = new Map();
    public $attrs: Map<string, any> = new Map();
    public $listeners: Map<string, any> = new Map();
    public $subscriptions: Map<string, any> = new Map();
    
    constructor(protected klass: any) {
        var { metadata } = klass;  // might already exist
        var { $members, $observedAttributes, $watchers, $elements, $attrs, $listeners, $subscriptions } = (metadata || {});
        
        this.$members = $members || this.$members;  // prefer existing if available
        this.$observedAttributes = $observedAttributes || this.$observedAttributes;  // prefer existing if available
        this.$watchers = $watchers || this.$watchers;  // prefer existing if available
        this.$elements = $elements || this.$elements;  // prefer existing if available
        this.$attrs = $attrs || this.$attrs;  // prefer existing if available
        this.$listeners = $listeners || this.$listeners;  // prefer existing if available
        this.$subscriptions = $subscriptions || this.$subscriptions;  // prefer existing if available
        
        klass.metadata = this;  // ensure has structure of this while this.${{x}} originates from first issuance and subsequently klass
        return this;  // `this` maintains references to those members from klass.metadata
    }
    
}


var DEFAULT_DESCRIPTOR = { writable: true, configurable: true, enumerable: true };


class DecoratorUtilities {  // DEP
    namespace(object: any, ns: string, keys: string[] = ns.split('.')): boolean {
        while (keys.length) if (!object[ keys[0] ]) object[ keys.shift() ] = { };
        return !!(new Function(`return constructor.${ns};`))();
    }
    ensure(object, namespace, key, value) {
        var exists = this.namespace(object, namespace);
        var set = new Function('value', `object.${namespace} = value;`);
        // var set = new Function('value', `object.${namespace}.${key} = value;`);
        var get = new Function(`return object.${namespace};`);
        
        set(value);
        return get();
    }
    meta(object, key, meta) {
        this.namespace(object, 'meta.members');
        object.meta.members[key] = meta;
    }
}


function ElementNode(definition: { selector: string, template?: string }, options: any = {}): any {
    var data = { ...definition, type: 'element', key: 'selector', options, members: {} };
    
    return function get(Class: any): any {
        Class.meta = data;
        return { ...data, Class };
    };
}
function AttributeNode(definition: { selector: string }): any {
    var data = { ...definition, type: 'attribute', key: 'selector' };
    
    return function get(Class: any): any {
        return { ...data, Class };
    };
}
function TextNode(definition: { selector?: RegExp|'#text' }): any {  // selector := TextNode.nodeValue || TextNode.charaterData
    /*
    if reInterpolate.test(node.[nodeValue,wholeText,textContent,data]) > node.nodeValue = interpolate(nodeValue)(parent/owner)
    */
    var { selector = '#text' } = definition;
    var data = { ...definition, type: 'text', selector };
    
    return function get(Class: any): any {
        return { ...data, Class };
    };
}
function CommentNode(definition: { selector?: RegExp|'#comment' }): any {  // selector := CommentNode.data || CommentNode.charaterData
    /*
    comments may be used to drive performance
    syntax can be used to drive directive(s) / operation(s): <!-- <psst! [next.parent]="v-modal" /> -->, etc
    if owner > core.$selectors.linkedList.get(<string>owner, this.nextElementSibling)
    */
    var { selector = '#comment' } = definition;
    var data = { ...definition, type: 'comment', selector };
    
    return function get(Class: any): any {
        return { ...data, Class };
    };
}
function Directive(definition: { type: '#text'|'#comment', selector: RegExp }): any {
    var { type } = definition;
    var get = {
        '#text': TextNode({ ...definition, selector: '#text' }),
        '#comment': CommentNode({ ...definition, selector: '#comment' }),
    }[ type ];
    
    return get;
}
function Pipe() {}
function Service(definition: { id?: string }): any {  // selector := CommentNode.data || CommentNode.charaterData
    var data = { ...definition, type: 'service' };
    
    return function get(Class: any): any {
        var { id: selector = Class.name } = data;
        return { ...data, selector, Class };
    };
}
function IoT() {}
function MicroService() {}

var decorators = new (class Decorators extends DecoratorUtilities {
    
    /**
     * @intention Provide a convenience method for mapping to correct behavior depending on input type to keep other methods clean.
     *      * If member is datum : this.observee
     *      * If member is method: this.observer
     *      * Note: data-members are not created until class instance construction (value === undefined)
     */
    observe = (attr?: string): any => {
        var thus = this;
        
        return function get(target: any, key: string, descriptor: any = {}): any {
            var { constructor } = target;
            var { value } = descriptor;
            var metadata = new Metadata(constructor);
            var descriptor = { ...descriptor, ...DEFAULT_DESCRIPTOR };
            var action = { true: 'observer', false: 'observee' }[ <any>!!value ];  // this.observee || this.observer
            var process = thus[action](attr);
            var data = process(...arguments);
            
            metadata.$members.set(key, data);
            return descriptor;
        };
    };
    observee(attr?: string): any {  // @usage: @observe('options') options: any;
        var thus = this;
        
        return function get(target: any, key: string, descriptor: any = {}): any {
            var { constructor } = target;
            var { get, set } = descriptor, hasGet = !!get, hasSet = !!set, hasGetOrSet = (hasGet || hasSet), hasGetAndSet = (hasGet && hasSet);
            var metadata = new Metadata(constructor);
            var name = (attr || key), alias = key;  // name === alias if !attr
            var data = { decorator: 'attribute:observee', name, alias, hasGet, hasSet, hasGetOrSet, hasGetAndSet };
            
            if (!hasGetOrSet) descriptor.writable = true;  // do not declare WHATSOEVER unless !hasGetOrSet
            metadata.$members.set(key, data);
            metadata.$observedAttributes.set(key, data);
            
            return data;
        };
    };
    observer(attr: string): any {  // @usage: @observe('options') handleOptionsChange(val, old) {}
        var thus = this;
        
        return function get(target: any, key: string, descriptor: any = {}): any {
            var { constructor } = target;
            var descriptor = { ...descriptor, ...DEFAULT_DESCRIPTOR };
            var { value: handler } = descriptor;
            var metadata = new Metadata(constructor);
            var name = key;
            var data = { decorator: 'attribute:observer', name, attr, handler };
            
            metadata.$members.set(key, data);
            metadata.$watchers.set(attr, data);
            
            return data;
        };
    };
    
    element(selector: string): any {  // DEP
        var thus = this;
        var isHost = (selector === 'this');
        
        return function get(target: any, key: string, descriptor: any = {}): any {
            var { constructor } = target;
            var descriptor = { ...descriptor, ...DEFAULT_DESCRIPTOR };
            var metadata = new Metadata(constructor);
            var name = key;
            var data = { decorator: 'reference:element', name, key, selector, isHost };
            
            metadata.$members.set(key, data);
            metadata.$elements.set(key, data);
            
            return descriptor;
        };
    };
    
    attr(selector: string): any {  // DEP
        var thus = this;
        var re = new RegExp(/^(.*)\[(.+)\]$/);
        var matches = re.exec(selector), [ match, tagName, attr ] = matches;
        var isHost = (tagName === 'this');
        
        return function get(target: any, key: string, descriptor: any = {}): any {
            var { constructor } = target;
            var descriptor = { ...descriptor, ...DEFAULT_DESCRIPTOR };
            var metadata = new Metadata(constructor);
            var name = attr;
            var data = { decorator: 'reference:attribute', name, key, selector, isHost };
            
            metadata.$members.set(key, data);
            metadata.$attrs.set(key, data);
            
            return descriptor;
        };
    };
    
    listener(type: string) {  // DEP
        var thus = this;
        var isHost = !type;
        
        return function get(target: any, key: string, descriptor: any = {}): any {
            var { constructor } = target;
            // var descriptor = { ...descriptor, ...DEFAULT_DESCRIPTOR };
            var { value: handler } = descriptor;
            var metadata = new Metadata(constructor);
            var name = key;
            var data = { decorator: 'handler:dom', name, key, type, handler, isHost };
            
            metadata.$members.set(key, data);
            metadata.$listeners.set(key, data);
            
            return descriptor;
        };
    };
    
    message(type: string): any {  // DEP
        
        return function get(target: any, key: string, descriptor: any = {}): any {
            var { constructor } = target;
            var descriptor = { ...descriptor, ...DEFAULT_DESCRIPTOR };
            var { value: handler } = descriptor;
            var metadata = new Metadata(constructor);
            var name = key;
            var data = { decorator: 'handler:comm', name, key, type, handler };
            
            metadata.$members.set(key, data);
            metadata.$subscriptions.set(key, data);
            
            return descriptor;
        };
    };
    
    trigger(action: string) {  // DEP
        class MethodProxy {
            constructor(private target: any, private name: string) {}
            apply(fn: Function, thus: any, args: any[]) {
                var { target, name } = this;
                var result = Reflect.apply(fn, thus, args);
                
                target[action](name, ...args);
                
                return result;
            }
        }
        
        return function get(target: any, key: string, descriptor: any = {}): any {
            var { value: fn } = descriptor;
            var proxy = new Proxy( fn, new MethodProxy(target, key) );
            var descriptor = { ...descriptor, value: proxy };
            
            return descriptor;
        };
    }

})();


const {
    observe, observee, observer,
    element, attr,
    listener, message,
    trigger,
} = decorators;

export { ElementNode, AttributeNode, TextNode, CommentNode, Directive, Pipe, Service };
export { observe, observee, observer };
export { element, attr };
export { listener, message };
export { trigger };
