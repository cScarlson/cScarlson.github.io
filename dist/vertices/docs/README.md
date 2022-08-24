
Vertices(JS)
====
A workaround to other frameworks.

## Vertices
Vertices (plural for _vertex_) are single files declared with the partial file name and extension, `.vertex.html`. For example, `app.vertex.html`. A single Vertex (the file) contains all of the code necessary to define an entire (single) module. That is: JavaScript, [one or more] HTML [fragments], and CSS. For example:

### _Defining_ a Module
```html
<script type="module">
    ...
</script>
<div --view>  <!-- don't forget to demarcate which fragment is the view! -->
    ...
</div>
<style>
    ...
</style>
```
Also note that _we do not necessarily have to declare the JavaScript & CSS **inline**_. These could be a `script[src]` & `link[href][rel="stylesheet"]`. This is _weakly recommended_, however, as keeping them in a single file reduces overhead of scaffolding, packaging, and arguably readability.

#### Leveraging Different Styles of Components
...

##### `function` Components (Live Components)
...
```html
<script type="module">
    import V, { LIFECYCLE_EVENTS } from './vertices/core.js';
    
    const { onmount } = LIFECYCLE_EVENTS;
    
    V('{some-type}')(function SometypeComponent({ self, module, metadata }) {
        return this;  // return this for databinding / automatic change-detection.
    });
</script>
```

##### Arrow `(function) =>` Components (Breakout Components)
...
```html
<script type="module">
    import V, { LIFECYCLE_EVENTS } from './vertices/core.js';
    
    const { onmount } = LIFECYCLE_EVENTS;
    
    V(('{some-type}')({ self, module, metadata }) => {
        return {};  // no change-detection! we returned our own object.
    });
</script>
```

#### Self, Module and Metadata
From the examples above, we have 3 objects injected into our components:

##### `self`
The `HTMLScriptElement` (`<script>`) bearing our module _definition_.
```javascript
self.parentElement === module;  // see "module"
```
##### `module`
The `HTMLUnkownElement` (`<module>`) encapsulating our module _declaration_.
```javascript
module.firstElementChild === self;  // see "self"
```
##### `metadata`
Metadata about a module declaration (_instance_).
```javascript
metadata.type === module.getAttribute('type');
metadata.src === module.getAttribute('src');
metadata.module === module;  // see "module"
metadata.clone === self;  // see "self"
// ...more
```


### Vertex File Conventions
Vertices expects the following ordinal convention for a vertex:
```html
<script type="module"></script>     <!-- 0 -->
<div --view></div>                  <!-- 1 -->
<style></style>                     <!-- 2 -->
```
While the `<script>` and HTML fragment (`<div>` in this case) may not matter too much (for the current version), having the `<style>` element declared last is _at least convenient_ as Vertices literally depends on the `load` event emitted from it to determine if everything has loaded. It _is_ possible (but not recommended) to add another empty `<style>` element at the bottom of the page if another order of elements is necessary. Leaving the `<script>` at the top makes it easier to access the `<module>` from the "_self_" reference (as its `parentElement`) and vice versa (as the `<module>`'s `firstElementChild`). Moreover, access to your HTML fragment can be made through the `nextElementSibling` of the _self_ (`<script>`) handle. Suffice to say that, as versions change, there may be more dependency on the convention above and, as support grows for _leveraging Sandboxes_, this may become either more or less relevant.

### _Declaring_ a Module
As a vertex is essentially just a fancy lazy-loaded _include_ or _partial_, we declare them in our markup. While other selectors are possible (basically **any**), a standard approach is to declare a module inside of a `<module>` (`HTMLUnknownElement`) element.

##### example
```html
<module type="app" src="./app/app.vertex.html"></module>
```
Note that we also added both a `type` and a `src` attribute to the declaration. This is necessary for the current version of Vertices, though future versions are anticipated to have more flexibility (for _unregistered_/"_static_"/"_typeless_" modules) and automation (for "_inline_"/"_self-defined_" and|or "_sourceless_"/"_source-mapped_" modules) around this.

As of _03/31/22_, we now have the option of...
##### `./**/*.vertext.html`
```html
<module type="app"></module>
<module type="other"></module>
...
```
...as long as it is accommodated by...
##### `./main.js`
```javascript
import V, { bootstrap } from './vertices/core.js';

const { docket } = V;

docket
    .set('app', './app/app.vertex.html')
    .set('other', './app/subsystem/other.vertex.html')
    ...
    ;
...
```

#### Template Syntax
##### Interpolation
```html
${someScopeVariable}
```
##### Looping
```html
<li +="something of somethingElse">${something.else}</li>
```
#### Property Binding
```html
<input .="value:someText" .="placeholder:somePlaceholder" .="dataset.x:someDataDashAttr" />
```
#### Slots
##### `./**/*.vertex.html`
```html
...
<span slot="title">Some Title</span>
...
```
##### Given
###### `./**/header.vertex.html`
```html
...
<h1 class="page title"><slot name="title"></slot></h1>
...
```


### State Management
Vertices comes with some basic state-management. It leverages _The Observer Pattern_ on every instance of a _Vertices Medium_ (see Vertices API). That is, the default medium (`V`) can be leverages with the `new` keyword to created more instances of itself. For example: `const app1 = new V(options)`.

Per The Observer Pattern, we can attach observers in the following ways. Also note that the pattern deviates from the observer pattern's specification where, instead of an observer encapsulating the `update` method that the _Subject_ invokes, we substitute an `call` method. This allows us to pass in a function to the `attach` method instead of an object. That is, JavaScript `function`s are unlimately an `Object` that natively bears an `call` method. In other words, as long as the observer has an `call` method it will be invoked with `(state, [ key ])`.

Assuming we called `V.set(key, value)` elsewhere in our application, we have the following implementation options:

#### `Object` Observers
```html
<script type="module">
    import V, { LIFECYCLE_EVENTS } from './vertices/core.js';
    
    const { onmount } = LIFECYCLE_EVENTS;
    
    V('{some-type}')(function SometypeComponent({ self, module, metadata }) {
        this.call = (state, type) => log(state, type);  // > {...} "some:key"
        V.attach(this);  // this has `call` method
    });
</script>
```

#### `Function` Observers
```html
<script type="module">
    import { V } from './vertices/core.js';
    
    V('{some-type}')(function SomeVertex({ self, module, metadata }) {
        
        function handleStateChange(type) {
            log(this, type)  // > {...} "some:key"
        }
        
        V.attach(handleStateChange);  // handleStateChange has a `call` method (Function.prototype.call).
        
        return this;
    });
</script>
```

Another deviation from The Observer Pattern's specification is that an observer gets automatically invoked upon attachment. You can turn this off using the `notify` flag:
#### `Function` Observers
```html
<script type="module">
    import { V } from './vertices/core.js';
    
    V('{some-type}')(function SomeVertex({ self, module, metadata }) {
        
        function handleStateChange(type) {
            log(this, type)  // > {...} "some:key"
        }
        
        V.attach(handleStateChange, false);  // only runs after other calls to V.set have occured.
        
        return this;
    });
</script>
```


## Vertices API
The Vertices object (`V`) leverages a JavaScript Design Pattern developed by Cody Carlson, inspired by John Resig's jQuery, in order to get the most functionality out of a single instance of Vertices. It behaves as _both a `function` and an `Object` (instance)_.


### `V(...)`
Invoking `V`...
```javascript
V('{some-type}');
```


### `V[method](...)`
Calling Methods...
```javascript
V[method](...);
```


### `new V({ ... })`
Discrete Media.
```javascript
const appA = new V({ ... });
const appB = new V({ ... });
const appZ = new new new new ... V({ ... });  // why? because we can.
```


### `V(component0)(component1)...(componentN)`
Curry Chaining...
```javascript
V('{some-type-0}')(component0)
 ('{some-type-1}')(component1)
 ...
 ('{some-type-n}')(componentN)
 ;
```


### `V[method0](...)[method1](...)...[methodN](...)`
Method Chaning...
```javascript
V[method0](...)
 [method1](...)
 ...
 [methodN](...)
 ;
```


### Methods
...


#### `V(string)()` and `V.register()`
```typescript
type TRegistrant = Function;
type TArgument = TRegistrant | TVerticesOptions;
type VFunction = (object: TArgument): VFunction;

interface VObject {
    register(registrant: TRestistrant): V;
}

type V = VFunction & VObject;
```

... ... ...


## Architectural Approaches
Vertices was built with architecture in mind. We try to keep it as simple and flexible as possible while bearing minimal opinion on how _we_ think _you_ should architect an application. ...


## Our Perspective on Application Architecture
... (infrastructure, suprastructure, scaffolding, archetype), EDA, Addy Osmani, Nicholas Zakas / pyramid / sandbox theory / module theory, ...

- suprastructure: fw (see Nich Zakas pyramid)
- infrastructure: (see Sandboxes, Facades, Application/Module Mediators, Addy diags)
- scaffolding: (see The Composite Pattern, project grooming, abstractions, and module hoisting)
- archetype: EDA, MVA, MVC, MVVM, etc.


Entropy...
