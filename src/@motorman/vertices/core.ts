
import { MutationManager } from './mutation.manager';
import { Lifecycle } from './lefecycle';

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

export { Core, Facade };
