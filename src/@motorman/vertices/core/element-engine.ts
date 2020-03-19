
import { Utilities, Deferred } from "@motorman/core/utilities";
import { IEventAggregator } from "@motorman/core/eventaggregator.interface";
import { StrictCommand as Command } from "@motorman/core/utilities/patterns/behavioral";
import { ChainOfResponsibility } from "@motorman/core/utilities/patterns/behavioral";

type ListenerMap = { type: string, name: string, handler: (e: Event, ...splat: any[]) => any };
type EventEmitter = IEventAggregator&(Comm|Hub);

var utils = new (class ElementUtilities extends Utilities {
    
    composeCommand(component: any, name: string) {
        var command = new Command(component, name);
        return command;
    }
    composeExecutor(component: any, name: string) {
        var command = this.composeCommand(component, name), { execute } = command;
        return execute;
    }
    mapExecutor(component: any, item: any) {
        var { name } = item;
        var handler = this.composeExecutor(component, name), details = { ...item, handler };
        return details;
    }
    
})();

class Channels {
    ['LEFECYCLE:ELEMENT:CREATED'] = 'vcomm://created/element';
    ['LEFECYCLE:ELEMENT:CONNECTED'] = 'vcomm://connected/element';
    ['ELEMENT:TEMPLATE:FOUND'] = 'vcomm://found/element/template';
    ['ELEMENT:MUTATION:OBSERVED'] = 'vcomm://observed/element/mutation';
    ['PROXY:INVOKED'] = 'vcomm://invoked/proxy';
    ['PROXY:CONSTRUCT:INVOKED'] = 'vcomm://invoked/proxy/construct';
    ['PROXY:HAS:INVOKED'] = 'vcomm://invoked/proxy/has';
    ['PROXY:GET:INVOKED'] = 'vcomm://invoked/proxy/get';
    ['PROXY:SET:INVOKED'] = 'vcomm://invoked/proxy/set';
    ['PROXY:DELETE:INVOKED'] = 'vcomm://invoked/proxy/delete';
    ['PROXY:APPLY:INVOKED'] = 'vcomm://invoked/proxy/apply';
    ['PROXY:MOCK:INVOKED'] = 'vcomm://invoked/proxy/mock';
}
class Hub implements IEventAggregator {
    private subscriptions: any = { };
    public channels: Channels = new Channels();

    constructor() {}
    
    private invoke(subscription, data) {
        var { channel, handler, context } = subscription;
        var e = new CustomEvent(channel, { detail: data });
        handler.call(context, e);
        return this;
    }

    publish(channel: string, data?: any, ...more: any[]) {
        if (!this.subscriptions[channel]) this.subscriptions[channel] = [ ];
        var subscriptions = this.subscriptions[channel];
        for (let i = 0, len = subscriptions.length; i < len; i++) this.invoke(subscriptions[i], data);
        return this;
    }
    subscribe(channel, handler) {
        if (!this.subscriptions[channel]) this.subscriptions[channel] = [ ];
        var subscription = { channel, handler, context: this };
        this.subscriptions[channel].push(subscription);
        return this;
    }
    unsubscribe(channel, handler) {
        if (!this.subscriptions[channel]) this.subscriptions[channel] = [ ];
        // this.target.removeEventListener(channel, handler, false);
        return this;
    }

}
class Comm implements IEventAggregator {
    private target = new EventTarget();
    public channels: Channels = new Channels();

    constructor() {}

    publish(channel: string, data?: any, ...more: any[]) {
        var e = new CustomEvent(channel, { detail: data });
        this.target.dispatchEvent(e);
        return this;
    }
    subscribe(channel, handler) {
        this.target.addEventListener(channel, handler, false);
        return this;
    }
    unsubscribe(channel, handler) {
        this.target.removeEventListener(channel, handler, false);
        return this;
    }

}

class ConstructorProxy {
    private comm: any;
    private Sandbox: any;
    private element: HTMLElement;
    private director: any;
    public sandbox: any;

    constructor({ comm, Sandbox, element, director }) {
        this.comm = comm;
        this.Sandbox = Sandbox;
        this.element = element;
        this.director = director;
    }

    construct(Target, args) {
        var { Sandbox, comm, element, director } = this;
        var sandbox = new Sandbox(element, comm, director);
        var params = [].concat(sandbox, 'extra');
        var data = { type: 'construct', Target, args };
        var result = Reflect.construct(Target, params /*, PrototypeConstructor*/);
        
        this.sandbox = sandbox;
        comm.publish(comm.channels['PROXY:INVOKED'], data);
        comm.publish(comm.channels['PROXY:CONSTRUCT:INVOKED'], data);
        
        return result;
    }
    
}

class MemberProxy {
    private comm: any;
    private source: any;
    private element: HTMLElement;

    constructor({ comm, source, element }) {
        this.comm = comm;
        this.source = source;
        this.element = element;
    }

    has(target: any, key: any) {
        var { source, comm } = this;
        var data = { type: 'has', source, key };
        var result = Reflect.has(source, key);
        
        comm.publish(comm.channels['PROXY:INVOKED'], data);
        comm.publish(comm.channels['PROXY:HAS:INVOKED'], data);
        
        return result;
    }

    get(target: any, key: any, receiver: any) {
        // if (target[key].call) return new Proxy( target[key], new MethodProxy({ comm: this.comm, source: this.source, element: this.element }) );
        var { source, comm, element } = this;
        var data = { type: 'get', source, key };
        var result = Reflect.get(source, key);  // omit receiver to get key of source
        
        comm.publish(comm.channels['PROXY:INVOKED'], data);
        comm.publish(comm.channels['PROXY:GET:INVOKED'], data);
        
        return result;
    }

    set(target: any, key: any, value: any, receiver: any) {
        var { source, comm } = this;
        var data = { type: 'set', source, key, value };
        var result = Reflect.set(source, key, value);
        
        comm.publish(comm.channels['PROXY:INVOKED'], data);
        comm.publish(comm.channels['PROXY:SET:INVOKED'], data);
        
        return result
    }

    deleteProperty(target: Function, key: any) {
        var { source, comm } = this;
        var data = { type: 'delete', source, key };
        var result = Reflect.deleteProperty(source, key);
        
        comm.publish(comm.channels['PROXY:INVOKED'], data);
        comm.publish(comm.channels['PROXY:DELETE:INVOKED'], data);
        
        return result;
    }

}

class MethodProxy {
    private comm: any;
    private source: any;
    private element: HTMLElement;

    constructor({ comm, source, element }) {
        this.comm = comm;
        this.source = source;
        this.element = element;
    }

    apply(target, thus, args) {
        var { source, comm } = this;
        var data = { type: 'apply', source, target, thus, args };
        var result = target.call(source, ...args);
        // var result = source[target.name](...args);
        // var result = target.call(thus, ...args);
        // var result = Reflect.apply(target, thus, args);
        
        comm.publish(comm.channels['PROXY:INVOKED'], data);
        comm.publish(comm.channels['PROXY:APPLY:INVOKED'], data);
        
        return result;
    }

}

class ProxyManager {  // sets up & manages proxy relationships
    
}

class Comparitor {
    public previous: any = undefined;
    get name(): string { return this.attr.name; }
    get current(): any { return this.component[ this.name ]; }
    set current(value: any) { this.attr.value = value; }
    get equal(): boolean { return this.detect(); }
    get dirty(): boolean { return !this.equal; }
    
    constructor(private comm: EventEmitter, private component: any, private attr: Attr) {
        var { name, value } = attr;
        this.previous = value;
        return this;
    }
    
    detect() {
        var { comm, name, previous, current } = this;
        var equal = (previous === current);
        var details = { name, previous, current, equal };
        
        if (!equal) comm.publish(comm.channels['ELEMENT:ATTRIBUTE:CHANGE'], details);
        return equal;
    }
    
    update() {
        var { name, component } = this;
        this.previous = this.current = component[name];
        return this;
    }
    
}

class TemplateVariable {  // TODO: this could probably just have attr passed in while using getters for everything
    name: string = '';
    attr: Attr = null;
    element: HTMLElement = null;
    
    constructor(options: any = {}) {
        var { name, attr, element } = options;
        
        this.name = name || this.name;
        this.attr = attr || this.attr;
        this.element = element || this.element;
        
        return this;
    }
    
}
class TemplateListener extends TemplateVariable {
    type: string = '';
    handler: (e: Event) => any;
    
    constructor(options: any = {}) {
        super(options);
        var { type, handler } = options;
        
        this.type = type || this.type;
        this.handler = handler || this.handler;
        
        return this;
    }
    
}
class TemplateManagementOptions {
    // reReference: RegExp = /^#(.+)$/;
    reAttrIn: RegExp = /\[(\w*)\]/;
    reStructural: RegExp = /^\*(\w*)$/;
    reListener: RegExp = /\((\w*)\)/;
    reListenerValue: RegExp = /(\w*)\((.*)\)/;
    // reInterpolable: RegExp = /{{([^{}]*)}}/g;
}
class AttributeManager {
    get name() { return this.attr.name; }
    get value() { return this.attr.value; }
    get element() { return this.attr.ownerElement; }
    
    constructor(protected attr: Attr) {
        var { name, value, ownerElement: element } = attr;
        attr.addEventListener('attributechange', this.handleChange, true);
        attr.addEventListener('mutation', (e) => console.log('MUTATION IS A NATIVE EVENT!'), true);
        attr.addEventListener('attributechange', (e) => console.log('MUTATION EVENT!'), true);
        return this;
    }
    
    destroy() {
        var { attr } = this;
        attr.removeEventListener('change', this.handleChange, false);
        return this;
    }
    
    private handleChange = (e: CustomEvent) => {
        var { name, value, element, attr } = this;
        var detail = { name, value, element, attr }, event = new CustomEvent('attributechange', { detail });
        console.log('@AttrManager # handleChange', e, this);
        element.dispatchEvent(event);
        
    };
    
}

class MutationManager {
    protected observer: MutationObserver = new MutationObserver( (r, o) => this.observe(r, o) );
    protected element: Element;
    
    constructor(protected comm: EventEmitter, protected component: any) {}
    
    private observe(changes: MutationRecord[], observer: MutationObserver) {
        for(let mutation of changes) this[mutation.type](mutation);
    }
    
    private ['childList'](mutation: MutationRecord) {
        var { element, component, comm } = this;
        console.log('A child node has been added or removed.');
        comm.publish(comm.channels[''], { mutation, element });
    }
    private ['attributes'](mutation: MutationRecord) {
        var { component, comm } = this;
        var { attributeName: name, target: element } = mutation;
        var attr = (element as Element).getAttributeNode(name);
        var detail = mutation, e = new CustomEvent('attributechange', { detail }), a = new CustomEvent('mutation', { detail });
        
        comm.publish(comm.channels['ELEMENT:MUTATION:OBSERVED'], mutation);
        element.dispatchEvent(e);
        attr.dispatchEvent(a);
    }
    private ['subtree'](mutation: MutationRecord) {
        var { element, component, comm } = this;
    }
    
    connect(element: Element, config?: any) {
        var { observer } = this;
        var config = { attributes: true, childList: true, subtree: true, ...config };
        
        this.element = element;
        observer.observe(element, config);
        
        return this;
    }
    
    destroy() {
        this.observer.disconnect();
        // destroy all attribute listeners as well
    }
    
}
class ContentManager {
    protected dTemplateReady: Deferred<boolean> = new Deferred();
    protected $variables: Map<string, Element> = new Map();
    protected attributes: AttributeManager[] = [ ];
    protected templateListeners: TemplateListener[] = [];
    protected mutations: MutationManager = new MutationManager(this.comm, this.component);
    public fragment: DocumentFragment|Element = new DocumentFragment();
    public template: string = '';
    public content: string = '';
    get component() { return this.element.component; }
    get comm() { return this.element.comm; }
    get $elementRefs() { return this.element.$elementRefs; }
    get elementRefs() { return this.element.elementRefs; }
    get $attrRefs() { return this.element.$attrRefs; }
    get attrRefs() { return this.element.attrRefs; }
    get listeners() { return this.element.listeners; }
    get reAttrIn() { return this.options.reAttrIn; }
    get reStructural() { return this.options.reStructural; }
    get reListener() { return this.options.reListener; }
    get reListenerValue() { return this.options.reListenerValue; }
    protected pipeNodeHandler = (handler: Function) => (e: CustomEvent) => handler.call(this, e.detail, e);
    protected nodeProcessors: ChainOfResponsibility = new ChainOfResponsibility({}, [
        { respond: this.pipeNodeHandler(this.processAttributeNodeRepeat) },  // note Execution Guards in method
        { respond: this.pipeNodeHandler(this.processElementNode) },
        { respond: this.pipeNodeHandler(this.processTextNode) },
        { respond: this.pipeNodeHandler(this.processCommentNode) },
        { respond: this.pipeNodeHandler(this.processAttributeNodeRepeat) },
    ]);
    protected pipeAttributeHandler = (handler: Function) => (e: CustomEvent) => handler.call(this, e.detail, e);
    protected attributeProcessors: ChainOfResponsibility = new ChainOfResponsibility({}, [
        { respond: this.pipeAttributeHandler(this.handlePropertyBinding) },
        { respond: this.pipeAttributeHandler(this.handleListenerBinding) },
    ]);
    
    constructor(private element: HTMLElement&any, private options: TemplateManagementOptions) {}
    
    parseNode(node: Node): Node {
        var { nodeProcessors: cor } = this;
        var e = new CustomEvent('domnodeprocess', { detail: <any>node })
          , e = cor.respond(e)
          , { detail: result } = e
          ;
        var { isConnected, parentNode: parent, previousSibling: previous, nextSibling: next, firstChild: child } = result;
        
        // RECURSION
        if (result !== node) return this.parseNode(result);  // reparse. assume replacement occurred. do not continue for next or child.
        if (child) this.parseNode(child);  // TCO???
        if (next) this.parseNode(next);  // TCO???
        this.dTemplateReady.resolve(true);  // gets fulfilled after last element processed. noop after that.
        
        return node;  // result can still equal node
    }
    
    private processAttributeNodeRepeat(node: Node&Element, response: CustomEvent): Node&Element {
        if (!{ '1': true }[ node.nodeType ]) return node;  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
        
        if ( !node.hasAttribute('*each') ) return node;
        else response.stopPropagation();  // discontinue processing. abort/break chain. do not pass into next process
        
        var attribute: Attr = node.getAttributeNode('*each')
          , replacement: Node&Element = this.handleStructuralRepeat(attribute)
          ;
        return replacement;
    }
    private handleStructuralRepeat(attr: Attr) {
        var { reStructural, component } = this;
        var { name, value, ownerElement: instructor } = <any>attr;
        var { previousSibling: previous } = instructor;
        var matches = reStructural.exec(name), [ match, type ] = matches;
        var [ namespace, property ] = value.split(' of ');
        var items = component[property] || [ { id: 3 }, { id: 2 }, { id: 1 } ];
        var ignore = instructor.removeAttribute(match);  // avoid infinite loop
        var clones = items.map( (item) => utils.interpolate(instructor.outerHTML)({ ...component, [namespace]: item }) )  // not working because utils.interpolate doesn't account for namespaces (x.y.z)
          , elements = clones.join('\n')
          ;
        instructor.outerHTML = elements;  // replace current element with clones. create real Nodes in DOM Tree & [Heap] memory.
        
        return previous.nextSibling;  // that node which now exists at instructor's index due to replacement
    }
    
    private processElementNode(node: Node&Element): Node&Element {  // Node.ELEMENT_NODE === 1
        if (!{ '1': true }[ node.nodeType ]) return node;  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
        var attributes: NamedNodeMap = node.attributes, attrs = Array.prototype.slice.call(attributes), attr = attrs.shift();
        var result = this.processAttributeNode(attr, ...attrs);
        
        return node;
    }
    private processAttributeNode(node: Node&Attr, ...more: (Node&Attr)[]): Node&Attr {  // Node.ATTRIBUTE_NODE === 2
        if (!node) return node;
        if (!{ '2': true }[ node.nodeType ]) return node;  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
        var { name, value, ownerElement: owner } = node;
        var { attributeProcessors: cor } = this;
        var e = new CustomEvent('domnodeattributeprocess', { detail: <any>node })
          , e = cor.respond(e)
          , { detail: result } = e
          ;
        var next: Node&Attr = more.shift();
        
        if (next) this.processAttributeNode(next, ...more);  // TCO???
        return node;
    }
    private handlePropertyBinding(node: Node&Attr): Node&Attr {
        if (!{ '2': true }[ node.nodeType ]) return node;  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
        if ( !this.reAttrIn.test(node.name) ) return node;
        var { reAttrIn, component } = this;
        var { name, value, ownerElement: owner } = node;
        var matches = reAttrIn.exec(name), [ match, property ] = matches;
        var { [value]: datum } = component;
        
        // console.log('ATTR (IN) %O', node, property, node.value, datum);
        // ownerElement.setAttribute(property, datum);
        owner[property] = datum;
        
        return node;
    }
    private handleListenerBinding(node: Node&Attr): Node&Attr {
        if (!{ '2': true }[ node.nodeType ]) return node;  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
        if ( !this.reListener.test(node.name) ) return node;
        var { templateListeners, reListener } = this;
        var { name, ownerElement: element } = node, matches = reListener.exec(name), [ match, type ] = matches;
        var handler = this.createBindingInvoker(node);
        var details = new TemplateListener({ name, type, node, element, handler });
        // console.log('LISTENER %O', node);
        
        templateListeners.push(details);
        return node;
    }
    private createBindingInvoker(attr: Attr): Function {
        var { component, reListenerValue } = this;
        var { name, value } = attr;
        var [ match, method, args ] = value.match(reListenerValue);
        var exe = utils.composeExecutor(component, method);
        var op = `with($_) return eval("h(${args})");`;
        var fn = new Function('$_', 'h', '$event', op);
        var f = (e) => fn(component, exe, e);
        
        return f;
    }
    
    private processTextNode(node: Node&Text): Node&Text {  // Node.TEXT_NODE === 3
        if (!{ '3': true }[ node.nodeType ]) return node;  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
        // var { component} = this;
        // var { data } = node;
        // var interpolated = utils.interpolate(data)(component);
        
        // console.log('TEXT %O', node);
        // // node.replaceWith(interpolated);
        // // console.log('TEXT %O', node, data, interpolated);
        
        return node;
    }
    
    private processCommentNode(node: Node&Comment): Node&Comment {  // Node.COMMENT_NODE === 8
        if (!{ '8': true }[ node.nodeType ]) return node;  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
        // var attrs: NamedNodeMap = node.attributes;
        
        // console.log('COMMENT %O', node);
        // for (let i = 0, len = attrs.length; i < len; i++) this.parseChildAttr(attrs[i], i, attrs);
        // this.parse(node.childNodes);
        
        return node;
    }
    
    /**
     * @intention : Leverage <template> &| DocumentFragment so that DOM objects do not change between parsing template variables & processing event-bindings.
     */
    refresh(template: string = '') {
        var { component, element, dTemplateReady } = this;
        var { promise: pTemplateReady } = dTemplateReady;
        var temp = document.createElement('template');
        var innerHTML = utils.interpolate(template)(component);
        
        // temp.innerHTML = innerHTML;
        // console.log('TEMPLATE %O', temp.content.childNodes);
        
        element.innerHTML = innerHTML;
        this.template = template;
        pTemplateReady
            .then( () => this.bindMutationObservers() )
            .then( () => this.bindElementNodeRefs() )
            .then( () => this.bindAttributeNodeRefs() )
            .then( () => this.bindListeners() )
            .then( () => this.dTemplateReady = new Deferred() )
            // .then( () => this.comm.publish(READY) )
            ;
        this.destroy()
            .parseNode(element.firstChild)
            ;
        return this;
    }
    
    appendTo(element: Element) {
        // var { content } = this;
        // this.element = element;
        // this.element.innerHTML = content;
        
        return this;
    }
    
    bind() {  // convert all of this to Promises using new Deferred() at this.processNode Tail-Call.
        this.bindMutationObservers()
            .bindListeners()
            .dTemplateReady = new Deferred()
            ;
        return this;
    }
    bindMutationObservers() {
        var { element, mutations } = this;
        mutations.connect(element);
        return this;
    }
    bindElementNodeRefs() {
        var { element, component, elementRefs } = this;
        // element.matches(selector);
        for (let { isHost, selector, key } of elementRefs) if (!{ 'function': true }[ typeof component[key] ]) isHost ? component[key] = element : component[key] = element.querySelector(selector);
        return this;
    }
    bindAttributeNodeRefs() {
        var { element, component, attrRefs } = this;
        // console.log('>>>>>>>', attrRefs);
        for (let { isHost, selector, key, name } of attrRefs) if (!{ 'function': true }[ typeof component[key] ]) isHost ? component[key] = element.getAttributeNode(name) : component[key] = element.querySelector(selector).getAttributeNode(name);
        return this;
    }
    bindListeners() {
        var { element, listeners, templateListeners, $elementRefs } = this;
        listeners.forEach( ({ key, type, handler }) => this.addNodeListener(key, type, handler ) );
        templateListeners.forEach( ({ element: target, type, handler }) => target.addEventListener(type, handler, false) );
        return this;
    }
    addNodeListener(key: string, type: string, handler: Function) {
        var { element, $elementRefs, $attrRefs } = this;
        var metadata = $elementRefs.get(key) || $attrRefs.get(key) || { };
        var { decorator, selector, isHost, name } = metadata;
        var target = {
            'true': element,
            'false': element['querySelector'](selector),
        }[ isHost ];
        var node = {
            'reference:element': target,
            'reference:attribute': target['getAttributeNode'](name),
        }[ decorator ];
        
        if ( !$elementRefs.get(key) && !$attrRefs.get(key) ) return this;
        if (  $elementRefs.get(key) &&  $attrRefs.get(key) ) return this;
        
        node.addEventListener(type, handler, false);
        
    }
    
    destroy() {
        var { listeners, templateListeners } = this;
        
        templateListeners.forEach( ({ element, type, handler }) => element.removeEventListener(type, handler, false) );
        templateListeners.length = 0;
        
        return this;
    }
    
}


class ElementEngine {
    
    constructor(private Sandbox: any, private director: any) {}
    
    private getConfig(Class, element) {  // TODO: fractionate routine
        var { director, Sandbox } = this;
        var { metadata } = Class;
        var { $members, $observedAttributes, $watchers, $elements: $elementRefs, $attrs: $attrRefs, $listeners, $subscriptions } = metadata;
        
        var comm = new Comm();
        var construction = new ConstructorProxy({ comm, Sandbox, element, director }); 
        var ClassProxy = new Proxy(Class, construction);
        var component = new ClassProxy({ state: false });
        var membersProxy = new MemberProxy({ comm, source: component, element });
        var methodsProxy = new MethodProxy({ comm, source: component, element });
        var proxy = new Proxy(component, membersProxy);
        var properties = Object.getOwnPropertyNames(Class.prototype);
        var methodBlacklist = { 'constructor': true, 'connectedCallback': true, 'attributeChangedCallback': true, 'disconnectedCallback': true, 'adoptedCallback': true };
        
        var members = Array.from( $members.values() )
          , watchers = Array.from( $watchers.values() )
          , elementRefs = Array.from( $elementRefs.values() )
          , attrRefs = Array.from( $attrRefs.values() )
          , listeners = Array.from( $listeners.values() ).map( (item) => utils.mapExecutor(component, item) )  // map each handler to a handler bound to "component"
          , subscriptions = Array.from( $subscriptions.values() ).map( (item) => utils.mapExecutor(component, item) )  // map each handler to a handler bound to "component"
          ;
        
        var surrogate = Object.create(proxy);  // use Object.create to carry over get|set; spread op fails to do so
        for (let key in proxy) if (proxy[key] && proxy[key].call) surrogate[key] = new Proxy(proxy[key], methodsProxy);
        properties.forEach( (key) => { if (!!component[key] && component[key].call && !methodBlacklist[key]) surrogate[key] = new Proxy(component[key], methodsProxy); });
        
        var config = {  // TODO: create fn
            comm,
            director,
            Sandbox,
            Class,
            ...{
                sandbox: construction.sandbox,
            },
            ...{
                $members, members,
            },
            ...{
                $watchers, watchers,
            },
            ...{
                $elementRefs, elementRefs,
                $attrRefs, attrRefs,
            },
            ...{
                $listeners, listeners,
                $subscriptions, subscriptions,
            },
            ...{
                component,
                surrogate,
            },
        };
        
        return config;
    }
    
    private prepare(Class) {
        var thus = this;
        var { metadata } = Class;
        var { $observedAttributes } = metadata;
        var observedAttributes = Array.from( $observedAttributes.values() ).map( ({ name }) => name )
        var templateOptions = new TemplateManagementOptions();
        // alert('needs element-selector-binding responsibility-handler in ContentManager');
        
        return class Element extends HTMLElement {  // https://alligator.io/web-components/attributes-properties/
            static get observedAttributes(): string[] { return observedAttributes }  // native HTML Custom Elements
            protected $utils: Utilities = new Utilities();
            private config: any = thus.getConfig(Class, this);
            private comm: EventEmitter = this.config.comm;
            private $: any = this.config.sandbox;
            private component: any = this.config.component;
            private surrogate: any = this.config.surrogate;
            //
            private $observedAttributes: Map<string, any> = this.config.$observedAttributes;
            private observedAttributes: any[] = this.config.observedAttributes;
            private $watchers: Map<string, any> = this.config.$watchers;
            private watchers: any[] = this.config.watchers;
            private $elementRefs: Map<string, any> = this.config.$elementRefs;
            private elementRefs: any[] = this.config.elementRefs;
            private $attrRefs: Map<string, any> = this.config.$attrRefs;
            private attrRefs: any[] = this.config.attrRefs;
            private $listeners: Map<string, any> = this.config.$listeners;
            private listeners: ListenerMap[] = this.config.listeners;
            private $subscriptions: Map<string, any> = this.config.$subscriptions;
            private subscriptions: any[] = this.config.subscriptions;
            //
            private $content: ContentManager = new ContentManager(this, templateOptions);
            private template: string = '';  // this.config.template;
            // private pTemplate: Promise<string> = this.config.pTemplate;
            private $comparitors: Map<string, Comparitor> = new Map();
            private handlers: any[] = [ ];
            get comparitors(): Comparitor[] { return Array.from( this.$comparitors.values() ); }
            // get content(): string { return this.$utils.interpolate(this.template)(this.component); }
            // set content(value: string) { this.innerHTML = value; }
            get attrs() { return observedAttributes; }
            get channels() { return this.comm.channels; }
            // get $elements() { return this.$content.$elements; }
            
            constructor() {
                super();
                var { comm } = this;
                
                this.bind();
                comm.subscribe(comm.channels['ELEMENT:MUTATION:OBSERVED'], (e) => console.log('@MUTATION', e) );
                comm.subscribe(comm.channels['ELEMENT:TEMPLATE:FOUND'], this.handleTemplate );
                comm.subscribe(comm.channels['PROXY:INVOKED'], this.handleProxyInvokation);
                comm.subscribe(comm.channels['PROXY:MOCK:INVOKED'], this.handleProxyInvokation);
                comm.publish(comm.channels['LEFECYCLE:ELEMENT:CREATED']);
                
                return this;
            }
            
            private bind() {
                var { comm, component, subscriptions } = this;
                var { observedAttributes: attributes } = Element;
                
                attributes.forEach( (key) => this.bindAttribute(key) );
                subscriptions.forEach( ({ type, handler }) => comm.subscribe(comm.channels[type], handler) );
                
                return this;
            }
            private bindAttribute(key: string) {  // KEEP?!!!
                var { component } = this;
                var descriptor = Object.getOwnPropertyDescriptor(Class.prototype, key)
                  , descriptor = { ...descriptor }
                  , { get, set } = descriptor
                  ;
                var value = this.getAttribute(key);
                if (!value) this.setAttribute(key, component[key]);
                if (descriptor.get && descriptor.set) descriptor = { get, set };
                else if (!descriptor.get && !descriptor.set) descriptor = { get: () => this.getAttribute(key), set: (v) => this.setAttribute(key, v) };
                else if (!descriptor.get && descriptor.set) descriptor = { get: () => this.getAttribute(key), set };
                else if (descriptor.get && !descriptor.set) descriptor = { get, set: () => this.setAttribute(key, component[key]) };
                Object.defineProperty(component, key, descriptor);
                
                return this;
            }
            
            // https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks
            connectedCallback() {
                var { comm, component } = this;
                // if (component.attachedCallback) component.connectedCallback();
                // this.$load();
                comm.publish(comm.channels['LEFECYCLE:ELEMENT:CONNECTED']);
            }
            attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
                var { component, $watchers } = this;
                // // var action = `[${attrName}]`, handler = component[action];
                // // var any = `[*]`, all = component[any];
                var $watcher = $watchers.get(attrName);
                
                // // if (component.attributeChangedCallback) component.attributeChangedCallback(attrName, oldVal, newVal);
                // // if (all) all.call(component, attrName, oldVal, newVal);
                // // if (handler) handler.call(component, newVal, oldVal);
                if ($watcher) $watcher.handler.call(component, newVal, oldVal);
                console.log('-------------', newVal, oldVal);
                // // this.$load();
            }
            disconnectedCallback() {
                var { component, listeners, subscriptions } = this;
                if (component.detachedCallback) component.disconnectedCallback();
                // listeners.forEach( (map) => this.unbindListener(component, map) );
                // subscriptions.forEach( (map) => this.unbindMessageHandler(component, map) );
                // this.$unload();
            }
            adoptedCallback() {
                var { component } = this;
                // if (component.adoptedCallback) component.adoptedCallback();
                // this.$load();
                console.log('--adoptedCallback--');
            }
            
            cycle() {
                var { template } = this;
                setTimeout( () => this.$content.refresh(template), 0 );  // let current callStack clear while element may still be mounting
            }
            
            private handleTemplate = (e: CustomEvent) => {
                var { type, detail: template } = e;
                this.template = template;
                this.cycle();
                // console.log('\n\n', 'WORKING ON TEMPLATE-HANDLING', '\n', template, '\n\n');
            };
            
            private handleProxyInvokation = (e: CustomEvent) => {  // KEEP?
                // var { component, attributes, content } = this;
                // var { type, detail } = e, { type: method } = detail;
                // var dirty = this.getDirtyAttributeStates(this.comparitors);
                
                // dirty.forEach( ({ name }) => this.initAttribute(component, attributes[name]) );
                // this.$load();
            };
            
        };
    }
    
    define(name, Class, options?: any) {
        if ( !!customElements.get(name) ) return this;
        var Element = this.prepare(Class);
        window.customElements.define(name, Element, options);
        
        return this;
    }
    
}

export { ElementEngine };

/* ================================================================================================================================
TODO

Refactor
Do less; simplify. Use EDA for more. Lifecycle Hooks should be CustomEvents from Comm.
 - ProxyManager: Create "ProxyManager" class -- passing in comm -- to manage Proxy operations & triggers.
 - AttributeValueProxy: R&D; see if a Proxy Trap can be set on attributes so that Events can be setup on `set()` for `.value`.
    - @watch: @watch Decorator should STILL be used ONLY for Host's observedAttributes -- BUT it should drive a subscription to an event
              published from attributeChangedCallback, which can be on the same or similar channel as other AttrValProxy events.
    - MutationObserver: R&D https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
 - Lifecycle Hooks: Lifecycle Hooks should be driven through Comm.
    - TODO: Define Lifecycle Flow.
 - @message: @message Decorator should be used for subscribing to Comm; leave assumption about Sandbox alone!
    - Operators: This will obviate the complexity around operators/operands etc! :-D
 - Comm: Comm should remain as disperate EventTarget as to not conflate DOM events with Object-to-Object tether.
 - Templates: Templates should have their own Channel while `component` is responsible for BOTH getting AND `.publish`ing a template. This
              way, components have control over lazyLoading and swapping out the template on the fly.
    - Templates should be loaded into a detached element, such as a DOMFragment, before interations to discover template refs, 
      bindings, and other variables.
    - TemplateRefs should be accessed through the element's $children Map.
 - Event Listeners: If there is a way to bind event-handlers before appending Content to DOM, after interpolation, this would be helpful.
 - Comm & Channels: Comm should be phased out using an @Decorator for subscriptions while providing access to Comm AND comm Channels ONLY
                    through methods (get|set for channels) on element.
 - Slots: Need <slot>s
 
 - EDA
    - Events can be published for TemplateRef variables while letting Developer decide what to do with them & their .ownerElement.
    
 - LEFECYCLE EVENTS & CHANNELS
    - ELEMENT:TEMPLATE:FOUND (watch out for Race Conditions)
    - ELEMENT:CREATED (constructor)
    - ELEMENT:TEMPLATE:CHECKED (DOM Fragment evaluation)
        // -? ELEMENT:TEMPLATE:VARIABLE:FOUND (DOM Fragment evaluation, TemplateRef)
        // -? ELEMENT:TEMPLATE:VARIABLES:FOUND (DOM Fragment evaluation, TemplateRef)
    - ELEMENT:CONTENT:CREATED (interpolated)
    - ELEMENT:CONTENT:CHECKED (injected/appended)
        // -? ELEMENT:TEMPLATE:LISTENER:BOUND (DOM Fragment evaluation, event-handler bound)
        // -? ELEMENT:TEMPLATE:LISTENERS:BOUND (DOM Fragment evaluation, event-handlers bound)
        // -? ELEMENT:TEMPLATE:ATTRIBUTE:BOUND (DOM Fragment evaluation, AttrValTrap & Listener bound)
        // -? ELEMENT:TEMPLATE:ATTRIBUTES:BOUND (DOM Fragment evaluation, AttrValTraps & Listeners bound)
    - ELEMENT:CONTENT:READY (checked + bound)
    - ELEMENT:READY (everything in its right place)
      [ADDITIONAL] ... which part of the sequence do these fall in?
    - ELEMENT:CONNECTED (LIFECYCLE METHOD)
    - ELEMENT:DISCONNECTED (LIFECYCLE METHOD)
    - ELEMENT:ADOPTED (LIFECYCLE METHOD)
    - ELEMENT:ATTRIBUTE:CHANGED (LIFECYCLE METHOD, could be same channel as AttrValTraps, but could also or instead be ELEMENT:OBSERBED-ATTRIBUTE:CHANGED)


REFACTOR 2


Syntax

Template (<input {{attr}}="{{variable}}"  />)
Event: Uses (click)="handle($event, variable, 'literal')"
Attribute: type="text", type="{{var}}", {{var}}="literal", {{attr}}="{{var}}"
Property I (ctrl -> el): [value]="var" (update element)
// Property O (el -> ctrl): {value}="var" (update controller)
TextNode: {{interpolation}}


Behavior

Template: Template gets inserted into element and immediately crawled.
Parsing: Parsing crawls element.childNodes to include TextNodes, crawls child.attributes, and recurses from child.childNodes.
Attributes: Each attribute is tested for its binding type, handled accordingly, and evaluated using an "evaluator".
TextNodes: TextNodes always get interpolated using an "evaluator".
ChildNodes: ChildNodes are parsed using strategy above.
Evaluator: Evaluator


Change Detection




Decorators

Class decorators should always contain a "meta" property (on their descriptor, Class, or [root] Prototype) with a "members" object.
Member decorators always assign metadata to a "meta" object on their Class under members[key] providing data for their purpose.
Decorators should have the capability to be leveraged compositively with each other, adding "meta" data to the descriptor.

@observe('prop') x: any;  // prepares metadata for observedAttributes (of "prop" with alias "x")
@observer('prop') handleChange(...?) {}  // prepares metadata for handler called from attributedChangedCallback
@element('tagName.class[attr]') element: HTMLElement;  // prepares metadata to select & bind an element to component['element'] (if not arguments.length then return HostElement or FirstChild or querySelector('*') or descriptor.name)
@attr('tagName.class[attr]') attr: Attr;  // prepares metadata to select & bind an element's attribute-node to component['attr'] (if not "[attr]" then return descriptor.name)
@listener('click') handleClick() {}  // prepares metadata to handle "click" on HostElement
@dispatcher('some-type') unique: EventTarget<CustomElement, 'some-type'>; this.unique.dispatchEvent(detail);
----
@listener('click') @element('tagName.class[attr]') handleClick({ target }) {}  // prepares metadata to handle "click" on metadata.selector of type "element"
@listener('change') @attr('tagName.class[attr]') handleChange({ ownerElement }) {}  // prepares metadata to handle "change" on metadata.selector of type "attr"


MISC
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf



RESOURCES
MutationObserver (AttrValProxy): https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
DocumentFragment (Preparations): https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
ShodowDOM: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM
================================================================================================================================ */
