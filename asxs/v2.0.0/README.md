
AsXS
================
<p style="font-size: var(--font-size-0); font-weight: var(--font-weight-7)">
    <iframe src="./app/children/copyright/copyright.rmd.html" is="as-frameless"></iframe>
</p>

# Frameless&trade;
Frameless is a Micro Frontend Architecture framework that largeley leverages _The Micro Frontend Pattern&trade;_. It uses _Remote Module Definitions&trade;_ to compose Web Components with standard RPF (Rapid Prototyping Framework) syntax, as seen in Svelte and Vue (Single File Components).


## Usage

### Standard
#### RMD Definition (Remote Module Definition)
```html
<body>
    <template>
        <h1>Frameless!</h1>
    </template>
    <style>
        :host {}
    </style>
    <script type="module">
        import { CustomElement } from '/asxs/v2.0.0/core/element/element.js';
        import { customElement } from '/asxs/v2.0.0/core/element/custom.js';
        
        customElement('my-app')
        (class AppElement extends CustomElement {});
    </script>
</body>
```

#### Declaration
```html
<!doctype html>
<html lang="en">
<head>...</head>
<body>
    <my-app>
        <iframe src="./app/app.rmd.html"></iframe>
    </my-app>
</body>
</html>
```

#### Output
```html
<!doctype html>
<html lang="en">
<head>...</head>
<body>
    <my-app>
        #shadow-root (open)
            <style>
                :host {}
            </style>
            <h1>Frameless!</h1>
    </my-app>
</body>
</html>
```


### External CSS
Web Components naturally lose the ability to import external stylesheets due to the Shadow DOM. To leverage styles external to the RCD, itself, there are two options.

#### LightDOM Components
Use the `createRenderRoot` override method and return `this` to convert the component to a LightDOM Component.

```html
<body>
    <template>
        <h1>Frameless!</h1>
    </template>
    <style>
        @import url('/some/where/else.css');
        my-app {}
    </style>
    <script type="module">
        import { CustomElement } from '/asxs/v2.0.0/core/element/element.js';
        import { customElement } from '/asxs/v2.0.0/core/element/custom.js';
        
        customElement('my-app')
        (class AppElement extends CustomElement {
            
            createRenderRoot() {
                return this;
            }
            
        });
    </script>
</body>
```

##### Output
```html
<!doctype html>
<html lang="en">
<head>...</head>
<body>
    <my-app>
        <style>
            @import url('/some/where/else.css');
            my-app {}
        </style>
        <h1>Frameless!</h1>
    </my-app>
</body>
</html>
```
> _Imports CSS globally to all non-Shadow-DOM scopes._

#### Global Asset Imports
Used `head > link.global.asset`.

```html
<head>
    <link class="global asset" href="/asxs/v2.0.0/styles/variables.css" rel="stylesheet" />
</head>
<body>
    <template>
        <h1>Frameless!</h1>
    </template>
    <style>
        :host {}
    </style>
    <script type="module">
        import { CustomElement } from '/asxs/v2.0.0/core/element/element.js';
        import { customElement } from '/asxs/v2.0.0/core/element/custom.js';
        
        customElement('my-app')
        (class AppElement extends CustomElement {});
    </script>
</body>
```
##### Output
```html
<!doctype html>
<html lang="en">
<head>
    ...
    <link class="global asset" href="/asxs/v2.0.0/styles/variables.css" rel="stylesheet" />
</head>
<body>
    <my-app>
        #shadow-root (open)
            <style>
                :host {}
            </style>
            <h1>CSS props are global and can pierce the ShadowDOM</h1>
    </my-app>
</body>
</html>
```


### Template Hooks
- Event-Handlers
- Template Directives

#### Event Handlers
RMDs inherit the ability to declaratively define Event-Handler hooks, making your code more readable. In your template, all you need is to point to the handler in your RMD class. Then, simply subscribe to the event with an _Event-Handler-Object_.

##### Abstract
- `{type}`: the string reflected by `Event.prototype.type`; e.g. `click`.
- `{referent}`: the unique identy of that which the handler is for; e.g. `some:subdomain:target`.

```html
<body>
    <template>
        <input data-({type})="{referent}" />
    </template>
    <style></style>
    <script type="module">
        import { CustomElement } from '/asxs/v2.0.0/core/element/element.js';
        import { customElement } from '/asxs/v2.0.0/core/element/custom.js';
        
        customElement('my-app')
        (class AppElement extends CustomElement {
            
            ['handle:{referent}:{type}'](e) {}
            
            connectedCallback( x = super.connectedCallback() ) {
                this.root.addEventListener('{type}', this, true);
            }
            
        });
    <script>
</body>
```

##### Concrete

```html
<body>
    <template>
        <input data-(change)="my:input" />
    </template>
    <style></style>
    <script type="module">
        import { CustomElement } from '/asxs/v2.0.0/core/element/element.js';
        import { customElement } from '/asxs/v2.0.0/core/element/custom.js';
        
        customElement('my-app')
        (class AppElement extends CustomElement {
            
            ['handle:my:input:change'](e) {}
            
            connectedCallback( x = super.connectedCallback() ) {
                this.root.addEventListener('change', this, true);
            }
            
        });
    <script>
</body>
```


#### `TemplateCrawler`
RMDs can employ a Template Crawler simply by adding an instance to your RMD's encapsulation.

```html
<body>
    <template>...</template>
    <style></style>
    <script type="module">
        import { CustomElement } from '/asxs/v2.0.0/core/element/element.js';
        import { customElement } from '/asxs/v2.0.0/core/element/custom.js';
        import { TemplateCrawler } from '/asxs/v2.0.0/core/element/template.crawler.js';
        
        customElement('my-app')
        (class AppElement extends CustomElement {
            ['crawler:template'] = new TemplateCrawler(this);
        });
    <script>
</body>
```

If a generic hook method exists, it will be called for every `Element` in the template.
```html
<body>
    <template>...</template>
    <style></style>
    <script type="module">
        import { CustomElement } from '/asxs/v2.0.0/core/element/element.js';
        import { customElement } from '/asxs/v2.0.0/core/element/custom.js';
        import { TemplateCrawler } from '/asxs/v2.0.0/core/element/template.crawler.js';
        
        customElement('my-app')
        (class AppElement extends CustomElement {
            ['crawler:template'] = new TemplateCrawler(this);
            
            ['crawler:template:handler'](element) {}
            
        });
    <script>
</body>
```

##### Template Directives
`TemplateCrawler` automatically looks for specific _Template Directives_.

- `.`: indicates a _property_ should be set on the Element Node based on the RMD's scope.
- `?`: indicates a _Boolean Attribute_ should be set on the Element Node based on the RMD's scope.
- `+`: reserved for generative actions.
  - `+for`: used for template looping based on the RMD's scope.

```html
<body>
    <template>
        <ul class="some list">
            <li class="list item" +for="let n of data" .innerHTML="${n}"></li>
        </ul>
    </template>
    <style></style>
    <script type="module">
        import { CustomElement } from '/asxs/v2.0.0/core/element/element.js';
        import { customElement } from '/asxs/v2.0.0/core/element/custom.js';
        import { TemplateCrawler } from '/asxs/v2.0.0/core/element/template.crawler.js';
        
        customElement('my-app')
        (class AppElement extends CustomElement {
            ['crawler:template'] = new TemplateCrawler(this);
            items = [ 1,2,3 ];
        });
    <script>
</body>
```

###### Output
```html
<ul class="some list">
    <li class="list item" -for="let n of data" .innerHTML="${1}">1</li>
    <li class="list item" -for="let n of data" .innerHTML="${2}">2</li>
    <li class="list item" -for="let n of data" .innerHTML="${3}">3</li>
</ul>
```
