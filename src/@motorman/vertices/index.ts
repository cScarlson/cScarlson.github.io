
import { default as showdown, Converter } from 'showdown';

var utils = new (class Utilities {
    
    interpolate(str) {
      return (o) => (new Function(`with (this) return \`${str}\`;`) ).call(o);
    }

})();

class EventManager {
  dispatcher = new EventTarget();
  target = null;
  types = [ ];
  delegate = () => {};
  getDelegate = (e, operation) => (new Function('$event', 'o', `with (o) return o.${operation};`)).bind(e, e);
  
  constructor(options) {
    var { target, handler } = options;
    this.target = target;
    this.delegate = handler;
  }
    
  getEventTypes(template) {
      var re = /\(([^()]+)\)=/img;
      var matches = (template.match(re) || []).map( match => match.replace(re, '$1') );
      return matches;
  }

  bind(template) {
    var { target } = this;
    var types = this.getEventTypes(template);
    
    this.unbind();
    this.types = types;
    this.types.forEach( (type) => target.addEventListener(type, this.handleEvent, true) );
    
    return this;
  }
  unbind() {
    var { target, types } = this;
    types.forEach( (type) => target.removeEventListener(type, this.handleEvent, false) );
    return this;
  }
  
  handleEvent = (e) => {
    if ( !e.target.hasAttribute(`(${e.type})`) ) return true;
    var { dispatcher, getDelegate } = this;
    var { type, target } = e;
    var { attributes } = target;
    var name = `(${type})`;
    var attr = attributes[name];
    var { value } = attr;
    var delegate = getDelegate(e, value);
    var detail = { event: e, type, attr, delegate };
    var event = new CustomEvent('*', { detail });
    
    dispatcher.dispatchEvent(event);
  };

  subscribe(channel, handler) {
    this.dispatcher.addEventListener(channel, handler, false);
    return this;
  }
  
}

class MutationManager {
  dispatcher = new EventTarget();
  core = null;
  target = null;
  observer = new MutationObserver( (r, o) => this.observe(r, o) );
  defaults = {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true,
      // attributeFilter: true,
  };

  constructor({ core, target }) {
    this.core = core;
    this.target = target;
  }

  observe(changes, observer) {
    for(let mutation of changes) this['any'](mutation);
  }

  connect(config: any = {}) {
    var { observer, defaults, target } = this;
    var config = { ...defaults, ...config };
    
    observer.observe(target, config);
    return this;
  }

  disconnect() {
    var { observer } = this;
    observer.disconnect();
    return this;
  }

  ['any'](mutation) {
    var e = new CustomEvent('*', { detail: mutation });
    this.dispatcher.dispatchEvent(e);
    this[mutation.type](mutation);
  }
  ['attributes'](mutation) {
    var e = new CustomEvent('attributes', { detail: mutation });
    this.dispatcher.dispatchEvent(e);
  }
  ['childList'](mutation) {
    var e = new CustomEvent('childList', { detail: mutation });
    mutation.addedNodes.forEach( (c) => V.bootstrap(c) );
    this.dispatcher.dispatchEvent(e);
  }
  ['subtree'](mutation) {
    var e = new CustomEvent('subtree', { detail: mutation });
    this.dispatcher.dispatchEvent(e);
  }
  ['characterData'](mutation) {
    var e = new CustomEvent('characterData', { detail: mutation });
    this.dispatcher.dispatchEvent(e);
  }

  subscribe(channel, handler) {
    this.dispatcher.addEventListener(channel, handler, false);
    return this;
  }

}

class Lifecycle {
  static $instances = new Map();
  utils = utils;
  Vertex = null;
  events = null;
  mutations = null;
  template = '';    // unfulfilled template
  reflection = '';  // fulfilled template
  selector = '';
  node = null;
  parent = null
  instance = null;
  $injections = new Map();
  
  constructor(core, options) {
    var { Vertex } = core;
    var { selector, node, decorators, Module, mutations } = options;
    var { innerHTML, children, childNodes } = node;
    var { template } = Module;
    var instance = core.instantiate(node, ...decorators, Module);
    var parent = core.getAncestor(node.parentElement);
    
    this.Vertex = Vertex;
    this.node = node;
    this.instance = instance;
    this.template = template;
    this.parent = parent;
    this.events = new EventManager({ target: node });
    this.mutations = mutations;
    this.mutations.connect({});
    if (template) this.addSlot(...childNodes).cycle();
    this.mutations.subscribe('*', this.handleMutation);
    this.events.subscribe('*', this.handleEvent);

    return this;
  }

  addSlot(node?, ...more) {
    if ( !node ) return this;  // abort
    if ( !{ [Node.TEXT_NODE]: true, [Node.ELEMENT_NODE]: true }[ node.nodeType ] ) return this;  // abort if not text or element
    if (  { [Node.TEXT_NODE]: true }[ node.nodeType ] && { '\n': true, '\s': true,  }[ node.data ] ) return this;  // abort if text but lame
    var id = { [Node.ELEMENT_NODE]: (node.slot || ''), [Node.TEXT_NODE]: '' }[ node.nodeType ];  // all text and *:not[slot] or *[slot=""] goes to "default"
    
    if ( !this.$injections.has(id) ) this.$injections.set(id, []);
    this.$injections.get(id).push(node);

    if (more.length) this.addSlot(...more);
    return this;
  }

  cycle() {
    var { Vertex: V, utils, node, instance, template } = this;
    var html = utils.interpolate(template)(instance);
    
    this.mutations.disconnect();
    this.events.bind(template);
    this.template = template;
    this.render(html);
    this.mutations.connect({});
    V(node.firstChild);
  }

  render(html) {
    var { node } = this;
    var doc = new DocumentFragment();
    var template = document.createElement('template');
    var content = template.content;

    template.innerHTML = html;
    doc.appendChild(content);
    this.slot(doc).load(doc);

    return this;
  }

  slot(container) {
    var slots = container.querySelectorAll('slot');
    slots.forEach( (slot) => this.inject( slot, ...this.$injections.get(slot.name) ) );
    return this;
  }

  inject(slot, injection?, ...more) {
    if (!injection) return this;
    slot.appendChild( injection.cloneNode(true) );
    if (more.length) this.inject(slot, ...more);
    return this;
  }

  load(doc) {
    var { node } = this;
    var { childNodes: contents } = doc;
    
    while (node.lastChild) node.firstChild.remove();
    for (let i = 0, len = contents.length; i < len; i++) this.attach(node, contents[i]);
    
    return this;
  }

  attach(node, child) {
    var clone = child.cloneNode(true);
    document.importNode(clone, true);
    node.appendChild(clone);
    return this;
  }
  
  ['mutation:*'](mutation) {
    var { instance } = this;
    var { type } = mutation;
    var handler = `mutation:${type}`;
    
    this[handler](mutation);
    if (handler in instance) instance[handler](mutation);
  }

  ['mutation:attributes'](mutation) {
    var { instance, node } = this;
    var { attributeName: name, oldValue: old } = mutation;
    var current = node.getAttribute(name);
    var handler = `mutation:attributes:${name}`;
    
    if (handler in instance) instance[handler](current, old, mutation);
  }

  ['mutation:childList'](mutation) {
    var { addedNodes, removedNodes } = mutation;
    var additions = Array.prototype.slice.call(addedNodes);
    var removals = Array.prototype.slice.call(removedNodes);
    
    this['mutation:childList:removed'](mutation, ...removals);
    this['mutation:childList:added'](mutation, ...additions);
  }
  ['mutation:childList:added'](mutation, node?, ...more) {
    var { instance } = this, handler = 'mutation:childList:added';
    if (handler in instance) instance[handler](mutation, node, ...more);
  }
  ['mutation:childList:removed'](mutation, node?, ...more) {
    var { instance } = this, handler = 'mutation:childList:removed';
    if (handler in instance) instance[handler](mutation, node, ...more);
  }

  handleMutation = (e) => {
    var { type, detail: mutation } = e;
    var handler = `mutation:${type}`;
    this[handler](mutation);
  };

  handleEvent = (e) => {
    var { instance } = this;
    var { detail } = e;
    var { event, type, attr, delegate } = detail;
    
    delegate(instance);
  };

}


const NETWORK = new EventTarget();
class Core {
  global = NETWORK;  // global comm between modules across vertices (instances of Core)
  target = new EventTarget();
  Vertex = null;
  engine = null;
  $services = new Map();
  $components = new Map();
  $lifecycles = new Map();
  $nodes = new Map();

  constructor(Vertex) {
    this.Vertex = Vertex;
    this.$services.set('core', { id: 'core', Module: Core, dependencies: [], instance: this });
  }

  use(engine) {  // maybe this should be abstracted to use processing middleware or perhaps for services too
    this.engine = engine;
    return this;
  }

  service(...splat) {
    var Module = splat.pop(), ids = splat.slice();
    var { id } = Module, dependencies = ids.map( (id) => ({ [id]: this.$services.get(id).instance }) );
    
    var services = dependencies.reduce( (o, s) => ({ ...o, ...s }), { });
    var instance = new Module(services);

    this.$services.set(id, { id, Module, dependencies, instance });

    return this;
  }

  component(...decorators) {
    var Module = decorators.pop();
    var { selector, template } = Module;
    this.$components.set(selector, { selector, template, Module, decorators });

    return this;
  }

  initialize(node) {
    this.engine.execute(this, node);
    return this;
  }

  instantiate(context, Module?, ...more) {
    var instance = new Module(context);
    if (more.length) return this.instantiate(instance, ...more);
    return instance;
  }
  
  mount(metadata, node) {
    if ( !node.matches(metadata.selector) ) return this;
    var { selector, template, Module, decorators } = metadata;
    var mutations = new MutationManager({ core: this, target: node });
    var options = { selector, node, decorators, Module, mutations };
    var lifecycle = new Lifecycle(this, options);

    this.$nodes.set(node, lifecycle);
    this.$lifecycles.set(node, lifecycle);
    return this;
  }

  getAncestor(node) {
    var instance = this.$lifecycles.get(node);
    
    if (!instance && !node.parentElement) return null;
    if (!instance &&  node.parentElement) return this.getAncestor(node.parentElement);
    return instance;
  }

  publish(channel, data, ...more) {
    var detail = data, e = new CustomEvent(channel, { detail });
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

  fire(channel, data, ...more) {
    var detail = data, e = new CustomEvent(channel, { detail });
    this.global.dispatchEvent(e);
    return this;
  }
  
  on(channel, handler) {
    this.global.addEventListener(channel, handler, false);
    return this;
  }
  
  off(channel, handler) {
    this.global.removeEventListener(channel, handler, false);
    return this;
  }

}

function Facade(core) {
  var thus = this;

  function use(bootstrap) {
    core.use(bootstrap);
    return this;
  }

  function service(...dependencies) {
    core.service(...dependencies);
    return this;
  }

  function component(...decorators) {
    core.component(...decorators);
    return this;
  }

  function bootstrap(node) {
    core.initialize(node);
    return this;
  }

  function mount(node) {
    core.engine.mount(node);
    return this;
  }

  function publish(channel, data, ...more) {
    core.publish(channel, data, ...more);
    return this;
  }

  function subscribe(channel, handler) {
    core.subscribe(channel, handler);
    return this;
  }

  function unsubscribe(channel, handler) {
    core.unsubscribe(channel, handler);
    return this;
  }

  // export precepts
  this.$services = core.$services;
  this.$components = core.$components;
  this.use = use;
  this.service = service;
  this.component = component;
  this.bootstrap = bootstrap;
  this.mount = mount;
  this.publish = publish;
  this.subscribe = subscribe;
  this.unsubscribe = unsubscribe;

  return this;
}

var V = (function Vertices(Core, Facade) {
    
    var core = new Core(Vertex), v = Facade.call( Vertex, core );  // watch for potential Race Condition on Vertex
    
    function Vertex(node, ...decorators) {
        if (this instanceof Vertex) return ( Vertices(Core, Facade) );
        if (!node) return Vertex;
        if (node && !{ 'undefined': true }[ node.nodeType ]) return (Vertex as any).mount(node);
        return (Vertex as any).component.call(Vertex, node, ...decorators);
    }
    
    return v;
})(Core, Facade);


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

class Director {
  static target = new EventTarget();

  constructor() {}

  publish(channel, data, ...more) {
    var e = new CustomEvent(channel, { detail: data });
    Director.target.dispatchEvent(e);
    return this;
  }

  subscribe(channel, handler) {
    Director.target.addEventListener(channel, handler, false);
    return this;
  }

  unsubscribe(channel, handler) {
    Director.target.removeEventListener(channel, handler, false);
    return this;
  }

}

class Sandbox {
  director = new Director();
  utils = utils;
  target = document.createElement('div');
  classList = this.target.classList;
  dataset = this.target.dataset;
  childNodes = this.target.childNodes;
  children = this.target.children;
  innerHTML = this.target.innerHTML;
  
  constructor(target) {
    var { classList, dataset, childNodes, children, innerHTML } = target;
    
    this.target = target;
    this.classList = classList;
    this.dataset = dataset;
    this.childNodes = childNodes;
    this.children = children;
    this.innerHTML = innerHTML;

    return this;
  }

  publish(channel, data, ...more) {
    this.director.publish(channel, data, ...more);
    return this;
  }

  subscribe(channel, handler) {
    this.director.subscribe(channel, handler);
    return this;
  }

  unsubscribe(channel, handler) {
    this.director.unsubscribe(channel, handler);
    return this;
  }
  
}

// |
// | USAGE
// V
// new Router([
//   { url: '', name: 'root', component: 'home' },
//   {
//     url: '/view',
//     name: 'some-view',
//     component: '404',
//     children: [
//       // ...
//     ]
//   },
//   { url: '!', name: '', component: '404' },
// ]);
class Route {  // Route & Router should be merged as a Composite Pattern where each route has previousSibling, next..., firstChild, etc.
  static observers: Node[] = [ ];
  static solutions: { url: string, param: string }[] = [ ];
  static state: any = { };
  static param: RegExp = /^\{(\w+)\}$/i;
  private $children: Map<string, Route> = new Map();
  get children() { return Array.from( this.$children.values() ) }
  get url() { return this.schema.url }
  get name() { return this.schema.name }
  get data() { return this.schema.data }
  get component() { return this.schema.component }
  
  constructor(public schema: any, public parent?: Route) {
    if (schema.push) return new Route({ url: '', name: 'vertex', children: schema });
    var { url } = schema;
    var parent = this.parent || this;
    var segments = url.split('/'), segment = segments.shift(); // split and take first item
    
    if (segments.length) return new Route({ url: segment, name: 'vertex', children: [ { ...schema, url: segments.join('/') } ] });
    this.schema = schema;
    this.parent = parent;
    if (schema.children) schema.children.forEach( schema => this.register(schema) );
    
    window.addEventListener('hashchange', this.handleHashChange, false);  // leverages Race-Conditions for first-match
  }
  
  static attach(node: Node, notify: boolean) {
    var { state } = this;
    var e = new CustomEvent('update', { detail: state });
    
    this.observers.push(node);
    if (notify) node.dispatchEvent(e);
    
    return this;
  }
  static detach(node: Node) {
    for (let i = this.observers.length; i--;) if (this.observers[i] === node) this.observers.splice(i, 1);
    return this;
  }
  static notify(state: any = this.state) {
    var e = new CustomEvent('update', { detail: state });
    this.observers.forEach( (node: Node) => node.dispatchEvent(e) );
    return this;
  }
  static solve(state: any, solution: any): any {
    var { url, key, value } = solution;
    state.url = `${state.url}/${url}`;
    if (key) state[key] = value;
    return state;
  }
  
  private register(schema: any) {
    var child = new Route(schema, this);
    this.$children.set(child.url, child);
  }
  
  private matches(segment: string): boolean {
    var { url } = this;
    var parameterized = Route.param.test(url);
    
    if (parameterized) return true;  // url is a placeholder (e.g. "{id}")
    if (segment === url) return true;  // exact match
    if (url === '*') return true;  // wildcard + 404 (is wildcard if has children, 404 if leaf node)
    return false;
  }
  
  public handleSegment(solutions: any[], segments: string[]) {
    var { parent, url } = this;
    var segment = segments.pop(), matches = this.matches(segment);
    var [ full, param ] = (url.match(Route.param) || []);
    var solution = { url, key: param, value: segment };
    
    solutions.unshift(solution);
    if (!matches) return Route.solutions;
    if (parent === this &&  segments.length) return Route.solutions;  // hierarchy too shallow (has more segments but not enough parents)
    if (parent !== this && !segments.length) return Route.solutions;  // hierarchy too deep    (ran out of segments but still has parent)
    
    if (segments.length) return parent.handleSegment(solutions, segments);
    return solutions;
  }
  
  private handleHashChange = (e: HashChangeEvent) => {
    var { newURL: hash } = e;
    var segments = hash.split('/');
    var solutions = this.handleSegment([], segments);  // maybe use recursion instead
    var state = solutions.reduce(Route.solve, { });
    
    if (solutions === Route.solutions) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    Route.state = state;
    Route.notify();
  };
  
}

class Markdown {
  converter = new Converter();
  state = '';

  constructor(converter?) {
    // showdown.setOptions({});
  }

  html(markdown) {
    var { converter } = this;
    var html = converter.makeHtml(markdown);
    return html;
  }

}

var pDocumentReady = new Promise(exe);

function exe(res, rej) {
  window.addEventListener( 'load', () => res(), false );
  if ( { 'complete': true, 'interactive': true }[ document.readyState ] ) res();
}

export { V, Bootstrap, Sandbox, Route, Markdown, utils, pDocumentReady as ready };
