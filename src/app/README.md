
Vertices(JS)
====
Awesomely simple. Powerfully small.

## Quick
```html
<app-example></app-example>
```

### Components
Components are simply a Decorator around a target Element (Node). An indefinite number of decorators can be applied, and each next decorator takes an instance of the previous in its registration.

##### Small, Simple.
```javascript
V(class ExampleComponent {
  static selector = 'app-example';
  static template = `...`;
  constructor(element) {}
});
```

##### Awesomely powerful.
```javascript
class Sandbox {
  target = null;
  constructor(element) {
    this.target = element;
  }
}
V(Sandbox, ..., class ExampleComponent {
  static selector = 'app-example';
  static template = `...`;
  constructor($) {
    $.target.dispatchEvent( new CustomEvent('output', { detail: {...} }) );
  }
});
```

### Templates
Its just a string.

```html
<div class="app example" (click)="handleClick($event, data, ...)">
  ...
  ${text}
  <img src="${src}" (load)="handleLoad($event, ...)" (error)="handleError($event, ...)">
  <ul>
    ${ items.map( (item) => `<li>${item.title}</li>` ).join('') }
  </ul>
  ...
</div>
```

### Services
Watch the Coupling. Services have their own DI container.

```javascript
V.service(class Utils { static id = 'utils'; constructor() { return utils; } });
V.service('utils', HTTP);
V.service('core', 'utils', 'http', ServiceSandbox);
V.service('sandbox', class TestService {
  static id = 'test';

  constructor($) {
    console.log('TestService', $);
  }

});
```

### Bootstrapping & Initialization
```javascript
window.addEventListener('load', (e) => V.use( new Bootstrap() ).bootstrap(document), false);
```


## Documentation


### Components

#### Modules
##### Requirements
The only real requirement for a component's declaration is a static member `selector`. Although, a static member `template` is _not_ required as it may be a "Static Component", it is reccommeded to set `template` to `false` as an explication.
###### `static selector = 'some-tag[or].css.selector'`;
###### `static template = '...' || false`;

###### Normative
```javascript
V(class NormativeComponent {
  static selector = 'anyCSS-selector';
  static template = '...';
});
```

###### Static Component
```javascript
V(class StaticComponent {
  static selector = 'anyCSS-selector';
  static template = false;
});
```

#### Templates
Remember, is just a string...

```html
<div class="app example" (click)="handleClick($event, data, ...)">
  ...
  ${text}
  <img src="${src}" (load)="handleLoad($event, ...)" (error)="handleError($event, ...)">
  <ul>
    ${ items.map( (item) => `<li>${item.title}</li>` ).join('') }
  </ul>
  ...
</div>
```

#### Slots
Although Vertices does not employ a `DocumentFragment` for `ShadowRoot`s, it still leverages the native `HTMLSlotElement` for content-projection.

##### Projections (Implementation)
```html
<app-example>
  <div slot="named">A</div>
  <div slot="named">B</div>
  <div slot="">C</div>    <!-- injected to default (if exists) -->
  <div slot>D</div>       <!-- injected to default (if exists) -->
  E                       <!-- injected to default (if exists) -->
</app-example>
```

##### Targets (Template)
```html
<div class="app example">
  <slot name="named"></div>
  <slot name=""></slot>   <!-- same as slot:not([name]) -->
  <slot></slot>           <!-- same as slot[name=""] -->
</div>
```

### Services

##### Requirements
Every service must bear the static member `id`. Upon registration, this is how other services may identify it for Dependency Injection. **Do note** that services are restricted to whichever Vertex they are registered to and can inject such `'core'` as a dependency. **However**, is best practice to implement a `Sandbox` to wrap the Vertext, itself, and have all other services inject the Sandbox instead.

```javascript
V.service(class Utilities {
  static id = 'utils';
  constructor({ /* empty */ }) {}
}).service('utils', class HTTP {
  static id = 'http';
  constructor(utils) {}
});

V.service('core', 'utils', 'http', class Sandbox {
  static id = 'sandbox';
  utils = null;
  http = null;

  constructor({ core, utils, http }) {
    this.utils = utils;
    this.http = http;
  }

});

V.service('sandbox', class UserService {
  static id = 'user';
  constructor({ sandbox: $ }) {
    $.utils.extend({}, {...});
    $.http.get(url).then(...);
  }
});
```

Note that Vertices does not care whether or not you use a `class` or `function` constructor. As so, while using TypeScript we may not care that `Sandbox` uses a `class` constructor, as we can make `core` a `private` member and receive warnings in our IDE for violations. However, there is no reason we should fear declaring `Sandbox` as a `function` constructor. This way, we can use "_The Revealing Module Pattern_" to _actually_ implement mobule privacy.

In this example, we use _The Revealing Module Pattern_ to implement object privacy. Here we export an api/interface to provide all services injecting it with a consistent & reliable interface while `core` stays hidden and private.
```javascript
function Sandbox({ core, utils, http }) {
  var thus = this;

  function publish(channel, data, ...more) {
    core.publish(channel, data, ...more);
    return this;
  }
  ...

  // export precepts
  this.utils = utils;
  this.http = http;
  this.publish = publish;
  this.subscribe = subscribe;
  this.unsubscribe = unsubscribe;

  return this;
}
Sandbox.id = 'sandbox';

V('core', 'utils', 'http', Sandbox)
```

### Bootstrap
There are two parts to initialization: providing the _Bootstrap Engine_ and initialization.

```javascript
V.use( new Bootstrap() );
```

```javascript
V.bootstrap(document));
```

After initalization, when a new Node is added to the DOM and needs to be attached & loaded to its appropriate module, simply register the node by passing it into Vertices.

```javascript
V(newlyAddedDOMNode);
```

### Extending The `Bootstrap` Engine
Rather than the following --
```javascript
V.use( new Bootstrap() );
```
-- we can extend `Bootstrap` for custom behavior. The _only_ requirement is that **the minimal public interface must be implemented**.

#### Requirements
```typescript
interface IBootstrap {
  execute(core: ICore, node: Node): any;
  mount(node: Node): Node;
}
```
While `execute` gets invoked immediately upon bootstrapping and calls `mount` (recursively), `mount` also gets invoked for any standalone calls to bootstrap an individual element.

#### Extending Bootstrap Example
```javascript
class MyBootstrapEngine extends Bootstrap {
  $services = new Map();

  constructor(config) {
    super();
  }

  execute(core, root) {
    this.$services = core.$services;
    super.execute();
    return this;
  }

  mount(node) {
    var result = super.mount(node);
    ...
    return result;
  }

}
window.addEventListener('load', (e) => V.use( new MyBootstrapEngine({...}) ).bootstrap(document), false);
```


### Multiple Vertices
Vertices is designed to 'sandbox' your code into multiple _contexts_ -- a single _Vertex_. That is, isolate or silo one area of code from another by creating multiple _Vertices_.

```javascript
var app = V;
V.on('CONTACT:FORM:SUBMISSION', (e) => handleContactForm(e) );
var app2 = new V();
...
var about = new V();
...
var contact = new V();

app2(class ContactComponent {
  static selector = 'app-contact';
  static template = '<form (submit)="handleSubmit($event)">...</form>';

  constructor() {}

  handleSubmit = (e) => {
    var data = getFieldData(e);
    app2.publish('CONTACT:FORM:SUBMISSION', data);
    e.preventDefault();
  };

});

app2.service(class ContactService {
  static id = 'contact';

  constructor() {
    app2.subscribe('CONTACT:FORM:SUBMISSION', this.handleSubmission);
  }

  handleSubmission = (e) => {
    var { detail: data } = e;
    app2.fire('CONTACT:FORM:SUBMISSION', (e) => handleContactForm(e) );
  };

});
```

In this example, we create multiple contexts with their own registration -- components, services, and anything else. The [very basic] ContactComponent listens for form submissions and `publish`es them within the `contact` Vertex. Everything within this Vertex can hear the event by default using `subscribe`. The ContactService listens for the message within the Vertex and posts the message _globally_, across all Vertices, using the `fire` method. Anything anywhere can hear messages `fire`ed by using the `on` method. In a nutshell, local messaging occurs for a single Vertex through `publish`, `subscribe`, and `unsubscribe`. Global messaging occurs across Vertices through `fire`, `on`, and `off`. _Note that **all of this is by default. More complex behavior can be implemented using advanced mediation patterns in order to squelch, translate, and transform messages**. This is where the power of using an **Application or Module Sandbox** comes in_.
