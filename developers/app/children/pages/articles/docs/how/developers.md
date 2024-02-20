
How ${name} Was Made
================================================================

The "developers" site (this site) was created using a technique that leverages `<iframe>`s to include _partials_. That is, an `iframe[partial]` that fetches the content from within an iframe and replaces the same node with its content. A `<meta>` tag alongside `<links>`, `<script>`s, `<template>`s, and more can be used to modify the partial's output element. Data, classes, and other properties can even be transposed into the output element via the `meta` element or even the iframe's properties -- not limited to the iframe's `location`'s `search` property. Alongside, the iframe's `innerHTML` can be leveraged to include `<slot>`-like behavior, making it even more configurable.

### Example: Partials

##### HTML (Parent)
```html
<script src="/{location}/frameless.js"></script>
...
<iframe partial name="{communicable-to-host}" src="./some/where/the/partial/lives.html?data=to&send=to&host=element">
    Some content to transclude
    <span slot="a-specific-slot">With content</span>
    more content to transclude in default slot with no name.
</iframe>
```
Properties of `iframe[partial]` get attached to its _replacement element_, though, they can be overwritten through the module's `meta` description (see below).

##### HTML (Host)
```html
<meta type="partial" name="some:element" class="host class" another-property="of host" />
<link rel="partial" href="./host.css" />
<script type="partial" src="./host.js"></script>

<template type=partial>
    ...
    <slot>Default (no name)</slot>
    ...
</template>
<template id="useableAndOptionalForComponent">
    ...
    <slot name="a-specific-slot"></slot>
    ...
</template>
```
One nice thing about this pattern is that, beside the optional extra attributes & properties, you can make `meta[name]` a _native_ element that the iframe will be replaced with. In fact, the `dialog[class="sideload modal"]` on this site (that houses the menu and previews) is actually a FramelessJS partial.

##### CSS
```css
.host.class {
    .class.x {
        .x.y {
            .y.z {}
        }
    }
}
```
We don't use CSS modules because a CSS _class-chaining_ pattern obviates the need for them.

##### JavaScript
```JavaScript
import { $ } from '/{location}/core.js';

$.set('some:element', ...eventTypes, class {
    
    constructor(sandbox) {}
    
    handleEvent(e) {  // handles all events in "eventTypes"
        if (e.type === 'hook:ready') return this.handleComponentReady(e);  // could be from this host or a child host
    }
    
});
```
While `<script>`s & `<link />`s are not required, this module uses a script that registers a component for the "`some:element`" module. When the iframe has been replaced with its host, the `hook:ready` event will fire. That means: a _child_ of this host can be heard when it loads and the parent can call `e.target.dispatchEvent(event)` to pass data to the child (among other things and other ways - see Intercomm Behavior). The `hook:ready` event is automatically attached so there is no need to include it within the `eventTypes` list.


### Intercomm Behavior
This site also leverages a _Web Worker_ as an event bridge between modules. When on _desktop_, a `SharedWorker` handles module communication. On _mobile_ `SharedWorker` is not available (yet) and so a fallback to a normative `Worker` instance is leveraged. Because both the SharedWorker and the Worker each `extends` an instance of a "Mediator", they behave the same regardless of their difference in protocol.

##### Example
```javascript
import { $ } from '/{location}/core.js';

$.set('some:element', class {
    
    constructor($) {
        const { target } = $;
        
        this.$ = $;
        $.subscribe('SOME:CUSTOM:CHANNEL', ({ data }) => log(data)); // "test"
        $.publish('SOME:CUSTOM:CHANNEL', 'test');
        $.subscribe('SOME:OTHER:CHANNEL', this);
    }
    
    handleEvent(e) {
        if (e.type === 'SOME:OTHER:CHANNEL') return this.handleOtherChannel(e);
    }
    
});
```

##### Interface
```typescript
interface ISandbox {
    target: HTMLElement;
    // |
    // | SharedWorker/Worker PubSub
    // V
    publish(channel: string, data: any): ISandbox;
    subscribe(channel: string, handler: Function | { handleEvent: Function }): ISandbox;
    unsubscribe(channel: string, handler: Function | { handleEvent: Function }): ISandbox;
    // |
    // | Window Messaging API PubSub
    // V
    upstream(channel: string, data: any): ISandbox;  // publish indefinitely up in scope toward root frame/window
    downstream(channel: string, data: any): ISandbox;  // publish indefinitely down in scope toward nth grandchildren frames/windows
    open(channel: string, handler: Function | { handleEvent: Function }): ISandbox;  // subscribe to both up & down stream comms
    unopen(channel: string, handler: Function | { handleEvent: Function }): ISandbox;  // unsubscribe to both up & down stream comms
}
```


### Routing
The way the `Route` module behaves is by leveraging a _Race Condition_ for matching. That is, each route listens for the `hashchange` event and whichever route matches first, wins. That means it has both matched the final segment in the hash-route's namespace (e.g. `['it', 'will', 'try', 'to', 'match', 'this-one']`) _and_ ALL of its parents have matched each of the preceding segments. A parent _can_ match the final segment but, if more segments exist in the segment list and this is the root-route (for example), it will not match. Once a _full_ match has occurred, the route calls `stopImmediatePropagation` on the `HashChangeEvent`, winning the Race Condition. All of this is to say: _routes defined higher in the schema tree will beat routes defined lower in the tree that may also legitimately match_.

##### Schemata (`**/routes.js`)
```javascript
const routes = {
    path: '#',
    name: 'root',
    children: [
        {
            path: '',
            name: 'app',
            target: './app/children/pages/home/home.html',
        },
        {
            path: 'tooling/ascii',
            name: 'tooling:ascii',
            target: './app/children/pages/ascii/ascii.html',
            children: []
        },
        {
            path: 'articles/how/developers',
            name: 'articles:how:developers',
            target: './app/children/pages/articles/readme/readme.html',
            data: { name: 'developers', doc: './app/children/pages/articles/docs/how/developers.md' },
            children: []
        },
        {
            path: 'articles/how/marketing',
            name: 'articles:how:marketing',
            target: './app/children/pages/articles/readme/readme.html',
            data: { name: 'marketing', doc: './app/children/pages/articles/docs/how/marketing.md' },
            children: []
        },
        {
            path: 'articles/how/employers',
            name: 'articles:how:employers',
            target: './app/children/pages/articles/readme/readme.html',
            data: { name: 'employers', doc: './app/children/pages/articles/docs/how/employers.md' },
            children: []
        },
        { path: '**', name: '404:root', target: './app/children/pages/404/404.html' },
    ]
}
```
Always starting with the root route (`path === '#'`) we can add children indefinitely. Each child can also have its own _404 Route_ (`path === '**'`) to implement its own handling of 404's. The `name` & `data` are optional. _Nth Root Routes_ (`path === ''`, empty) at any scale can be used to define a handler for an empty space after the last s/ash (`#/`, `#/app/`); this is because `Route` treats the empty space as an entity because `'#/'.split('/') === ['#', '']`. You _can_ define a handler for the root route (`path === '#'`), though likely preferred to target the hash-route `'#/'` instead of `'#'`.

Notice that for some of these routes (`**/articles/**`) we _could_ have just as well used an _abstract route_. That is, the `path` could have been `articles/how/{type}`, since our `target` remains the same component. If all that is needed is a simple `{type}` (or `{id}` etc) then that's a great way to implement it. If, perhaps, we have data that cannot be easily mapped off of the route's _path parameter_, then explicit routes with `data` are a good way to go.

##### Usage (Observer Functions)
```javascript
import { Route } from '**/route.js';
import { default as schema } from '**/routes.js';

function observeLocation(state) {
    if (!this.initialized) return;  // this === {router} for observer *functions*
    const { route, data, params, routes } = state;
    const { id, target } = route;
    const { path } = data;
    const root = this.routes.get('#');
}

Route.attach(observeLocation).init();
```

##### Alternatively (Observer Objects)
```javascript
import { Route } from '**/route.js';
import { default as schema } from '**/routes.js';

const observer = {
    call(router, state) {
        if (!router.initialized) return;  // this === observer for observer *objects*
        const { route, data, params, routes } = state;
        const { id, target } = route;
        const { path } = data;
        const root = router.routes.get('#');
    }
};

Route.attach(observer).init();
```
This is because can observer simply expects to have a `call` method, which `Function.prototype` naturally does, so, calling `observer.call(router, state)` also works for objects with a `call` method. You may have noticed that this is looking much like _The Observer Pattern_. That is because it does; `Route` in fact implements a `Subject` from this pattern in order for observers to `attach` & `detach` themselves when they want to get notified of state changes.

##### Upcoming For `Route`...
- Route Guards
- Redirects
- Compositive Route Outlets


### Sources (To Inspect)
- <a class="source link" target="_blank" href="/developers/app/children/sideload/sideload.html">Sideload Component</a>
- <a class="source link" target="_blank" href="/developers/app/sandbox.js">Sandbox</a>
- <a class="source link" target="_blank" href="/developers/app/children/router/route.js">Router</a>
- <a class="source link" target="_blank" href="/developers/app/worker.shared.js">SharedWorker</a>
- <a class="source link" target="_blank" href="/developers/app/worker.js">Worker</a>
- <a class="source link" target="_blank" href="/developers/app/mediator.js">Mediator</a>
