
AsXS
================
<p style="font-size: var(--font-size-0); font-weight: var(--font-weight-7)">
    <iframe src="./app/children/copyright.rmd.html" is="as-frameless"></iframe>
</p>

# Frameless&trade;
Frameless is a Micro Frontend Architecture framework that largeley leverages _The Micro Frontend Pattern&trade;_. It uses _Remote Module Definitions&trade;_ to compose Web Components with standard RPF (Rapid Prototyping Framework) syntax, as seen in Svelte and Vue (Single File Components).


## Usage

## Standard
#### RCD Definition (Remote Component Definition)
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
        
        customElement('as-app')
        (class AsXSAppElement extends CustomElement {});
    </script>
</body>
```

#### Declaration
```html
<!doctype html>
<html lang="en">
<head>...</head>
<body>
	<as-app>
		<iframe src="/asxs/app/app.rcd.html"></iframe>
	</as-app>
</body>
</html>
```

#### Output
```html
<!doctype html>
<html lang="en">
<head>...</head>
<body>
	<as-app>
		#shadow-root (open)
            <style>
                :host {}
            </style>
            <h1>Frameless!</h1>
	</as-app>
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
        as-app {}
    </style>
    <script type="module">
        import { CustomElement } from '/asxs/v2.0.0/core/element/element.js';
        import { customElement } from '/asxs/v2.0.0/core/element/custom.js';
        
        customElement('as-app')
        (class AsXSAppElement extends CustomElement {
            
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
	<as-app>
        <style>
            @import url('/some/where/else.css');
            as-app {}
        </style>
        <h1>Frameless!</h1>
	</as-app>
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
        
        customElement('as-app')
        (class AsXSAppElement extends CustomElement {});
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
	<as-app>
        <style>
            :host {}
        </style>
        <h1>Frameless!</h1>
	</as-app>
</body>
</html>
```
