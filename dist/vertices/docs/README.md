
Vertices
====

##### `./app/app.vertex.html`
```html
<!-- @name: app -->
<script type="module" lang="js" defer>
    import { V } from './vertices/core.js';
    
    const { log } = console;
    const module = document.querySelector('module[src="./app/app.vertex.html"]');
    const content = module.querySelector('.app.content');
    
    V({
        ['v:type']: 'app',
        call(self, module) {
            log(`@app.call`, this, self, module);  // > [object Object], <script>, <module> (this !== self)
        }
    });
    
    // const App = function App(module) {
    //     const self = this;
    //     log(`@App.call`, this, self, module);  // > <script>, <script>, <module> (this === self)
    //     return this;
    // }
    // App['v:type'] = 'app';
    // V(App);
    
    // console.log('%c @app.vertex', 'background: black; color: green');
    // console.log('@MODULE', module);
    
    function handleMount(e) {
        const { type, detail } = e;
        // console.log('@LIFECYCLE', type, detail);
    }
    
    function handleMenuState(e) {
        const { classList } = content;
        const { detail } = e;
        const { opened } = detail;
        const status = 'defocused';
        
        if (opened) classList.add(status);
        else classList.remove(status);
    }
    
    function handleHashchange(e) {
        setTimeout( () => location.hash = location.hash.replace('/noop', ''), 1000 );
    }
    
    // log('IMPORTED!...');
    module.addEventListener('vertex:mount', handleMount, false);
    module.addEventListener('menu:state', handleMenuState, true);
    window.addEventListener('hashchange', handleHashchange, false);
</script>

<div class="app root">
    <header class="app header">
        <module type="menu" src="./app/subsystem/menu.vertex.html" slot="menu"></module>
    </header>
    <div class="app content page canvas" slot="page">
        <div class="content canvas">
            <h1 id="/" class="page title">Home</h1>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <h1 id="/app/about" class="page title">About</h1>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <h1 id="/app/resume" class="page title">Resume</h1>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <h1 id="/app/cv" class="page title">Curriculum Vitae</h1>
            <br />
            <br />
            <br />
            <br />
            ...
            <br />
            <br />
            <br />
            <br />
            ...
            <br />
            <br />
            <br />
            <br />
            ...
            <br />
            <br />
            <br />
            <br />
            ...
            <br />
            <br />
            <br />
            <br />
            ...
            <br />
            <br />
            <br />
            <br />
            ...
            <br />
            <br />
            <br />
            <br />
            ...
            <br />
            <br />
            <br />
            <br />
            ...
            <br />
            <br />
            <br />
            <br />
            ...
            <br />
            <br />
            <br />
            <br />
            ...
            <br />
            <br />
            <br />
            <br />
            ...
            <br />
            <br />
            <br />
            <br />
            ...
            <br />
            <br />
            <br />
            <br />
            ...
            <br />
            <br />
            <br />
            <br />
            ...
            <br />
            <br />
            <br />
            <br />
            ...
            <br />
            <br />
            <br />
            <br />
            ...
            <br />
            <br />
            <br />
            <br />
            ...
        </div>
    </div>
    <footer class="app footer page canvas">
        <h1 id="/app/footer" class="page title">Footer</h1>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
    </footer>
</div>
<!-- 
    vertices.load() can look at the id of the <module> to auto-bootstrap the registered JS class, which is declared within the markup.
    <module type="example" src="./app/example.vertex.html">
        <script type="module">
            import { V } from './vertices/core.js';
            
            V(class ExampleComponent {
                static type = 'example';
                
                constructor(target: Element|Sandbox) {
                    const { parentElement: module, nextSibling: element } = target;  // natural convention for handle on cardinal element.
                    const { nextSibling: styles } = element;
                    
                    module.addEventListener('vertex:{lifecycle-event}', ...);
                    
                }
                
            });
        </script>
        <div class="app example">
            <div v="directive1,directive2,...,directiveN"></div>
        </div>
        <style>...</style>
    </module>
 -->

<style lang="css">
    @import url("./vertices/revert.css");
    @import url("./vertices/styles.css");
    
    .app.root {
        background:
            linear-gradient(transparent, lightsalmon),
            radial-gradient(circle at 40% 200px, #f09819 80px, transparent 280px),
            radial-gradient(circle at 36% 500px, #1845ad 80px, transparent 280px),
            radial-gradient(circle at 64% 360px, #ff512f 80px, transparent 280px)
            ;
        background-size: 100%;
        background-attachment: fixed;
        background-repeat: no-repeat;
        background-origin: border-box;
        position: relative;
        height: 100%;
        border-width: 0px;
    }
    
    .app.root .app.header {
        position: sticky;
        top: 0;
        z-index: 999;
    }
    
    .app.root .app.content {
        width: 100%;
        border-style: solid;
        border-width: 10px;
        border-color: rgba(255, 255, 255, 0);
        border-radius: 0;
        transform: scale(1);
        transition: transform 1s, border 1s, border-radius 1s, top 1s;
        transform-origin: top;
    }
    .app.root .app.content.defocused {
        position: sticky;
        top: calc(var(--menu-height) + 12px);
        height: 100vh;
        margin-top: 12px;
        border-color: rgba(255, 255, 255, 1);
        border-radius: 100px;
        transform: scale(0.2);
        transition: transform 1s, border 1s, border-radius 1s, top 1s;
        overflow: hidden;
        transform-origin: top;
        z-index: 0;
    }
    
    .app.root .app.content .content.canvas {
        width: 100%;
        max-width: 720px;
        margin-left: 50%;
        border: solid 10px transparent;
        transform: translateX(-50%);
        transition: transform 1s;
        background-color: rgba(255, 255, 255, 0.15);
    }
    
    .app.root .app.footer {
        position: sticky;
        top: 0;
        background-color: lightslategray;
        z-index: 1;
    }
    
    
    .page.canvas {
        min-height: 100vh;
    }
    .page.title {
        height: var(--menu-height);
        color: black;
        background-color: rgba(255, 255, 255, 0.15);
    }
</style>
```

##### `./app/subsystem/menu.vertex.html`
```html
<script type="module" defer>
    import { V } from './vertices/core.js';
    const menu = document.querySelector('.app.menu');
    const toggle = menu.querySelector('.menu.control.toggle');
    const { log } = console;
    
    V(class MenuComponent {
        static ['v:type'] = 'menu';
        self = null;
        menu = null;
        toggle = null;
        
        constructor(self) {
            this.self = self;
        }
        
        call(module) {
            log(`@MenuComponent.call`, this, this.self, module);  // > [object Object], <script>, <module> (this !== self)
        }
        
    });
    
    function handleToggle(e) {
        const { target } = e;
        const { checked } = target;
        const detail = { opened: checked };
        const event = new CustomEvent('menu:state', { detail });
        
        console.log(`@TOGGLE`, checked);
        menu.dispatchEvent(event);
    }
    
    function handleHashchange(e) {
        const detail = { opened: false };
        const event = new CustomEvent('menu:state', { detail });
        
        toggle.checked = detail.opened;
        menu.dispatchEvent(event);
    }
    
    toggle.addEventListener('change', handleToggle, false);
    window.addEventListener('hashchange', handleHashchange, false);
</script>

<div class="app menu">
    <input class="menu control toggle" type="checkbox" />
    <span class="menu icon">&#8801;</span>
    <slot class="menu canvas" name="menu">
        <div>
            <a href="#/noop/">Home</a>
        </div>
        <div>
            <a href="#/noop/app/about">About</a>
        </div>
        <div>
            <a href="#/noop/app/resume">Resume</a>
        </div>
        <div>
            <a href="#/noop/app/cv">Curriculum Vitae</a>
        </div>
        <div>
            <a href="#/noop/app/footer">More</a>
        </div>
    </slot>
</div>

<style>
    :root {
        --menu-height: 48px;
    }
    .app.menu {
        /* border: solid 1px tomato; */
        width: 100%;
        height: var(--menu-height);
        background-color: rgba(0, 0, 0, 0.75);
        box-shadow: 0px 0px 8px 2px black;
    }
    .app.menu .menu.control.toggle {
        outline: solid 1px tomato;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: var(--menu-height);
        height: var(--menu-height);
        margin: 0;
        padding: 0;
        opacity: 0;
        z-index: 1;
        cursor: pointer;
    }
    .app.menu .menu.icon {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: var(--menu-height);
        height: var(--menu-height);
        margin: 0;
        padding: 0;
        font-size: var(--menu-height);
        line-height: var(--menu-height);
        cursor: pointer;
        color: white;
    }
    .app.menu .menu.canvas {
        position: absolute;
        top: var(--menu-height);
        display: block;
        width: 100%;
        height: calc(100vh - var(--menu-height));
        transform: scale(0);
        transform-origin: center;
        transition: transform 500ms;
        background-color: rgba(0, 0, 0, 0.75);
        background-clip: padding-box;
        border-top: double 10px rgba(255, 255, 255, 0.5);
    }
    .app.menu .menu.control.toggle:checked ~ .menu.icon {
        color: #f09819;
    }
    .app.menu .menu.control.toggle:checked ~ .menu.canvas {
        transform: scale(1);
        transition: transform 500ms;
    }
    .app.menu .menu.canvas a {
        color: white;
        text-decoration: none;
    }
</style>
```

## Vertices
Vertices (plural for _vertex_) are single files declared with the partial name and extension, `.vertex.html`. For example, `app.vertex.html`. A single Vertex (the file) contains all of the code necessary to define an entire (single) module. That is: JavaScript, [one or more] HTML [fragments], and CSS. For example:

### _Defining_ a Module
```html
<script>
    ...
</script>
<div>
    ...
</div>
<style>
    ...
</style>
```

### Vertex File Conventions
Vertices expects the following convention for a vertex:
```html
<script></script>
<div></div>
<style></style>
```
While the `<script>` and HTML fragment (`<div>` in this case) may not matter too much (for the current version), having the `<style>` element declared last is _at least convenient_ as Vertices literally depends on the `load` event emitted from it to determine if everything has loaded. It _is_ possible (but not recommended) to add another empty `<style>` element at the bottom of the page if another order of elements is necessary. Leaving the `<script>` at the top makes it easier to access the `<module>` from the "_self_" reference (as its `parentElement`) and vice versa (as the `<module>`'s `firstElementChild`). Moreover, access to your HTML fragment can be made through the `nextElementSibling` of the _self_ (`<script>`) handle. Suffice to say that, as versions change, there may be more dependency on the convention above and, as support grows for _leveraging Sandboxes_, this may become less relevant.

### _Declaring_ a Module
As a vertex is essentially just a fancy, lazy-loaded _include_ or _partial_, we declare them in our markup. While other selectors are possible (basically **any**), a standard approach is to declare a module inside of a `<module>` (`HTMLUnknownElement`) element.

##### example
```html
<module type="app" src="./app/app.vertex.html"></module>
```
Note that we also added both a `type` and a `src` attribute to the declaration. This is necessary for the current version of Vertices, though future versions are anticipated to have more flexibility (for _unregistered_/"_static_"/"_typeless_" modules) and automation (for "_inline_"/"_self-defined_" and|or "_sourceless_"/"_source-mapped_" modules) around this.


## Vertices API
The Vertices object (`V`) leverages a JavaScript Design Pattern developed by Cody Carlson, inspired by John Resig's jQuery, in order to get the most functionality out of a single instance of Vertices. It 


### `V(...)`
Invoking `V`...
```
V({
    ['v:type']: 'my-component',
    ...
});
```


### `V[method](...)`
Calling Methods...
```
V[method](...);
```


### `new V({ ... })`
Discrete Media.
```
const appA = new V({ ... });
const appB = new V({ ... });
```


### `V(component0)(component1)...(componentN)`
Curry Chaining...
```
const appA = new V({ ... });
const appB = new V({ ... });
```


### `V[method0](...)[method1](...)...[methodN](...)`
Method Chaning...
```
const appA = new V({ ... });
const appB = new V({ ... });
```


### Methods
...


#### `V()` and `V.register()`
```typescript
type TRestistrant = TComponentFunction | TComponentObjectLiteral | TComponentClass;
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
... (infrastructure, suprastructure, scaffolding, archetype), EDA, Addy Osmony, Nicholas Zakas / pyramid / sandbox theory / module theory, ...

- suprastructure: fw (see Nich Zakas pyramid)
- infrastructure: (see Sandboxes, Facades, Application/Module Mediators, Addy diags)
- scaffolding: (see The Composite Pattern, project grooming, abstractions, and module hoisting)
- archetype: EDA, MVA, MVC, MVVM, etc.


Entropy
