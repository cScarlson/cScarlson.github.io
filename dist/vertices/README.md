
Vertices
====
A workaround to other frameworks.

## TL;DR
...

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
```html
<module type="{name}" src="./some/path/to/static/{name}.vertex.html"></module>
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
Turning elements off. `V.unregister(id)`.

### Decorators

### `each[for]`

### `<slot>`s

### `Store`
#### `Reducer`?

## Patterns
TBD

### The Observer Pattern
TBD

### ...more TBD

### DS (Data-Structures & Algorithms)


## API

### `V(...)` & `V.register(...)`
Same thing.

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

### `new V(...)` instances


### Garbage Collection

### Exentensibility
Data-Exchange Event Protocol.

### Limitations
Routing?
Environments?
Property Binding?

### Contributing
...

## ToDos
- ~~rename include to partial~~
- ~~complete module. rename to vertex?~~
- test nested `<each>`s
- module for `<input>`s to help with databinding?
