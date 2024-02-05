
Vertices
====
A workaround to other frameworks.

## TL;DR
Quickstart...

## Components
```javascript
V('some:element', function SomeElement($) {
    const { tagName, attributes, dataset } = this;
    
    function init() {
        this.on('some:event', this);
        this.on('some:other:event', this, true);  // use capture?
        this.fire('some:type', { ... });
        this.fire('some:other:type', this, { bubbles: true });  // event-init options.
    }
    
    function handleEvent(e) {  // use Event Delegation
        const { type } = e;
        const handler = {
            'some:event': someHandler,
            ...
        }[ type ];
        
        if (!handler) return;
        handler.call(this, e);
    }
    
    // export precepts
    this.init = init;
    this.handleEvent = handleEvent;
    
    return this;  // don't forget!
});
```

## Partials
```html
<partial src="./some/path/to/static/{name}.html"></partial>
```
## Modules (`*.vertex.html`)
SvelteJS style components. 
```html
<vertex type="{name}" src="./some/path/to/static/{name}.vertex.html"></vertex>
```
### `**/some/path/to/static/{name}.vertex.html`
```html
<script type="module">
    import V, {} from '/vertices/core.js';
    V('{name}', ...);
</script>

<div>...</div>
<!-- and|or -->
<template>...</template>

<style></style>
```

## Decorators
Decorators in Vertices are First Class. In fact, all a Component is is a registration with only 1 single decorator. Decorators can be applied indefinitely to attach behavior to a particular element.
```javascript
V('some:element', ...[ ... ]);
V('some:element', A, B, C, D, ..., SomeElement);
```

## Rendering
It's up to you. Vertices makes no assumptions or judgements about how your app -- or any particular module -- retrieves its content. It can be an XHR/fetch, an import, static, hardcoded, Content Projection (#ng), or even from another element such as a `<template>`.

### Template Interpolation
Again, Vertices makes no assumptions or judgements about how you retrieve or inject your content. However, Vertices does ship with a Utilities module with an `interpolate` method.
```javascript
import utils, { utils as x, Utilities } from '/vertices/utilities.js';
const interpolate = utils.interpolate(template);
const output = interpolate({ ... });
```

## SDK
Later versions of Vertices are expected to have an SDK that is composed of reusable elements such as classical Design Patterns, basic Data-Structures and Algorithms, alongside additional DOM components. Below are some teasers for what to expect.

### Decorators
TBD

### `<slot>`s
Slot elements in Vertices work just [about] like they do natively. Define a `<slot>` in a template and it will receive the elements injected into the component, depending on `*[slot]` & `slot[name]` conventions. The only place this deviates from native behavior is: `<slot>`s do not necessarily need a `name` property to function. Nameless slots simply adopt any injected content that either has no name (such as `TextNode`s) or elements defining `slot=""` (empty string).

### `Store`
Verticies ships with the convenience of a store which implements _The Observer Pattern_ in order to attach and detach observers. The only place the interface deviates from the classical Observer Pattern is: instead of providing an `update` method on one's observer, it invokes `call`. This means that the developer call pass-in any object with a `call` method -- which includes a `Function`, as its `prototype` encapsulates a `call` method.

#### `Reducer`
Vertices currently does not ship with a reducer base-class, though, this is expected to change _very_ soon. The `Reducer` class simply provides apparatus around action-routing in tandem with triggering `notify` on the `Store`.

## Patterns
TBD

### The Observer Pattern
TBD

### ...more TBD

### DS (Data-Structures & Algorithms)


## API

### `V(...)` & `V.register(...)`
Calling Vertices as a function (`V()`) is the same as calling the `register` method (`V.register(...)`). This method simply takes an id, 0 or more _Decorators_, alongside a component definition. Take note, however, that modifications to `V`'s signature are dependent upon version, though backward compatibility will always remain a top goal.

### `V.unregister(id)`

### `V('x', 'y', X)` vs `V('x', Y, X)` vs `V('x', y, X)`
Consider we have a component named "x" with its corresponding class `X`. We have 3 different ways of adding decorators. This assumes that a definition for "y" has taken place before bootstrap.
```javascript
V('y', ..., Y);
```
#### String: `V('x', 'y', X)`
This assumes that registration for component "`'y'`" has already taken place _by the time that "`'x'`" is bootstrapped_. Vertices will lookup the decorator definition(s) for y and apply them at y's given position in x's definition.
#### Function Constructor: `V('x', Y, X)`
This performs no lookup relating to decorator `Y` but still uses Y as a decorator for x.
#### Object: `V('x', y, X)`
This is the same as using a Function Constructor. However, object `y` must bear a `call` method whose signature takes the target-element as its first argument (`y.call(element)`).

### `new V(...)` Instances
Constructing a new instance of `V` returns a new, sandboxed instance of an application core. That is, media for broadcasting data across modules is scoped only to those registered to a particular core instance. This allows one to restrict messages to a given context without every module in your app hearing those messages.

### Garbage Collection
Vertices manages most of everything when DOM Nodes are added or removed from the DOM. However, the developer still must take the usual heed of unsubscribing from particular events. More Garbage Collection methods are expected to be added in the near future.

### Exentensibility
Data-Exchange Event Protocol. Coming soon.

### Limitations
- Routing: Vertices does not currently ship with a router.
- Environments: Vertices remains indifferent to environmental configuration.
- Property: Vertices tries to be as light weight as possible while keeping modules as close to the action as possible. Convenience usually derives from the use of Decorators as opposed to core apparatus.

### Contributing
We're still in Alpha phases for Vertices and not excepting contribution at the moment.

## ToDos
- module for `<input>`s to help with databinding.
- automatic scope binding for event-handlers based upon template syntax.
