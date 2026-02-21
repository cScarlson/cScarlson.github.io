
Frameless
================
This document describes the Frameless framework, its intention, behavior, and usage.


## TL;DR
```html
<iframe src="somewhere/public/some.red.html" is="as-frameless"></iframe>
```
> _Fetches and loads a Remote Element Definition._


## Usage

### RED Protocol: Remote Element Definitions
Frameless assumes that we use the RED protocol for structuring our remote target elements. RED files have a specific structure that is similar to other RPF (Rapid Prototyping Framework) formats, as seen in Vue.

#### `~/**/*.red.html`
We use the convention of `.red.html` for our Remote Element Definition.
```html
<body>
    <meta name="{tagName}" />
    <template>...</template>
    <style>:host { ... }</style>
    <script>
        const { parent } = window;
        const { customElements, HTMLElement } = parent;
        const TAGNAME = '{tagName}';
        
        if ( !customElements.get(TAGNAME) ) customElements.define(TAGNAME, class SomeElement extends HTMLElement {
            constructor(options: RemoteElementDefinitionOptions) {
                super();
            }
        });
    </script>
</body>
```
> _Where `tagName` is the literal tagName of your component._

> _We always ensure we define the element in the parent frame's `customElements` registry._

> _REDs load in a child frame and are subject to all security constaints that are normal for an `iframe`._

> _More elements can exist in the RED's `body` (and elsewhere, such as a `head`), such as using TSNova for TypeScript support, or other scripts you may want to load in the child frame for other types of support._

#### RED Protocol
The RED protocol calls for a specific order of our primary elements:
```typescript
interface RemoteElementDefinition extends HTMLCollection {  // Schema/Protocol for RED (Remote Element Definition)
    0: HTMLMetaElement,
    1: HTMLTemplateElement,
    2: HTMLStyleElement,
    3: HTMLScriptElement,
}
```

#### RED `RemoteElementDefinitionOptions`
When a Remote Element Definition is constructed, it receives a `RemoteElementDefinitionOptions` object in its constructor.
```typescript
interface RemoteElementDefinitionOptions {
    meta: HTMLMetaElement;
    template: HTMLTemplateElement;
    styles: HTMLStyleElement;
    script: HTMLScriptElement;
    attributes: NamedNodeMap;
    contentDocument: Document;
    frame: HTMLIframeElement;
}
```
```typescript
class SomeElement extends HTMLElement {
    constructor(red: RemoteElementDefinitionOptions) {
        super();
        const { meta, template, styles, script, attributes, contentDocument, frame } = red;
        const { ['class']: { value: classes } } = attributes;
        const { dataset } = frame;
        
        template.innerHTML = utilities.interpolate(template.innerHTML)({ ... });
        style.innerHTML = utilities.interpolate(style.innerHTML)({ ... });
        
        Object.assign(this.dataset, dataset);  // pass down data-attributes from declaration to RED.
        this.className += classes;  // pass down other attributes from declaration to RED.
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(template.content);
    }
}
```

#### Basic
##### `~/**/some.red.html`
```html
<body>
    <meta name="my-element" />
    <template>
        <h1>Title</h2>
    </template>
    <style>:host { ... }</style>
    <script>
        const { parent } = window;
        const { customElements, HTMLElement } = parent;
        const TAGNAME = 'my-element';
        
        if ( !customElements.get(TAGNAME) ) customElements.define(TAGNAME, class SomeElement extends HTMLElement { ... });
    </script>
</body>
```
##### `~/**/*.element.html`
```html
<iframe src="somewhere/public/some.red.html" is="as-frameless"></iframe>
```
##### DOM
```html
<iframe src="somewhere/public/some.red.html" is="as-frameless">
    #document
</iframe>
<as-red>
    #shadow-root (open)
        <my-element>
            #shadow-root (open)
                <style>:host { ... }</style>
                <h1>Title</h2>
        </my-element>
</as-red>
```
> _The original `iframe` remains in DOM as the RED could still be executing operations tied to the child frame's Browsing Context._

> _Remote Element Definitions can be courteous by crowling up the DOM tree to remove the child frame if it is no longer needed._


### Static REDs
Static REDs can be defined by using the `partial` keyword on the `meta` element. Partials can run their own scripts and, optionally, use automatic interpolation by setting the primary `script`'s `type` to `application/json` while providing a JSON string to be interpolated into the template (**and styles**).

```html
<body>
    <meta name="partial" />
    <template id="template">
        <article class="static partial">
            <h1>Static RED Partial</h1>
            <h2>Terms And Conditions</h2>
            <p>Signer, ${name}, agrees to have their ass handed to them no matter what. Because we have ${nouns}.</p>
        </article>
    </template>
    <style>
        .static.partial {
            color: darkcyan;
            cursor: not-allowed;
            &::before {
                content: "${content}";
            }
        }
    </style>
    <script type="application/json">
        {
            "name": "Avery Juan",
            "nouns": "lawyers",
            "content": "Disclaimer"
        }
    </script>
    <script>
        const { log } = console;
        const template = document.querySelector('#template');
        const article = template.content.querySelector('.static.partial');
        const h1 = article.querySelector('h1');
        
        h1.innerHTML += '!';
        log(`@STATIC/PARTIAL`, template, article);
    </script>
</body>
```

#### Output
```html
<as-red>
    #shadow-root (open)
        <my-element>
            #shadow-root (open)
                <style>
                    .static.partial {
                        color: darkcyan;
                        cursor: not-allowed;
                        &::after {
                            content: "Disclaimer";
                        }
                    }
                </style>
                <article class="static partial">
                    <h1>Static RED Partial!</h1>
                    <h2>Terms And Conditions</h2>
                    <p>Signer, Avery Juan, agrees to give up their First Child.</p>
                    ::after ("Disclaimer")
                </article>
        </my-element>
</as-red>
```


### Slots
Frameless allows you to provide 2 types of slotted content
- Weakly Slotted Content
  - Injected as an innerHTML string.
  - Derived from `iframe[is="as-frameless"].innerHTML`.
  - Destroys all references from parent component.
  - Good to use in tendem with Event Delegation.
- Strongly Slotted Content
  - Injected as literal DOM `Node`s.
  - Derived from an `iframe[is="as-frameless"]` parent [`as-frameless-slots`]'s `childNodes`.
  - Retains all object references as it is not a string but a literal DOM `Node`.
  - Usable as normal `*[slot]`s.

```html
<iframe src="./v0.0.1/weak.red.html" is="as-frameless"> <!-- Weakly Slotted Content -->
    <p>Default Slot Content</p>
    <div>More Default Content</div>
    <div slot="named">Named Slot</div>
</iframe>

<as-frameless-slots> <!-- Strongly Slotted Content -->
    <iframe src="./v0.0.1/strong.red.html" is="as-frameless"></iframe>
    <p>Default Slot Content 2</p>
    <div>More Default Content 2</div>
    <div slot="named">Named Slot 2</div>
</as-frameless-slots>
```
> _Both Strongly and Weakly slotted content can be used in tandem with one another._


### Using Vite & Rollup
If not accessing a RED from a statically served directory, you may want to point your Frameless iframe to a`.red.html` file during the complilation phase. Frameless leverages Vite (which leverages Rollup), which has you covered. Simply use the `?url` sentinel on the import and interpolate that URL into the template you declare the `iframe[is="as-frameless"]` element in.

#### `~/**/my.element.ts`
```typescript
import { CustomElement, customElement } from '@asxs/core';
import { default as template } from './my.element.html?raw';
import { default as styles } from './my.element.css?raw';
import { default as hero } from './children/hero/hero.red.html?url';

export const TAGNAME = 'my-element';
export @customElement(TAGNAME) class MyElement extends CustomElement {
    get __state__() {
        return { hero };
    }
    
    render(): string {
        return `
            <style>${styles}</style>
            ${template}
        `;
    }
    
};
```
#### `~/**/my.element.html`
```html
<iframe src="${hero}" is="as-frameless"></iframe>
```


## TypeScript Support
Currently, Frameless does not support TypeScript directly. However, you still have multiple options to leverage TypeScript within your Remote Element Definitions.

### TSNova
TSNova is a fast & acceptable option in our opinion. Please research TSNova for more information on its performance, scalability, and more.
```html
<script src="https://cdn.jsdelivr.net/gh/pjdeveloper896/TSNova@latest/dist/ts-runtime.min.js"></script>
<body>
    ...
    <script type="text/typescript">
        const constant: string = '';
    </script>
</body>
```
> _VS Code automatically recognizes `script[type="text/typescript"]` in HTML files._

### Built-In Frameless `TypeScriptElement`, "`as-typescript`".
```html
<body>
    ...
    <script is="as-typescrpt" type="text/typescript">
        const constant: string = '';
    </script>
</body>
```
> _Frameless ships with an `as-typescript` element that extends `HTMLScriptElement`_. However, it does not yet implement a TSCompiler algorithm that is performant enough to call acceptable; this is a top goal that we wish to accomplish in the very near future. However, with Remote Element Definitions, _you_ could build one for all to benefit from!


## More Information

### Why Remote Element Definitions are a big deal
In 1995, Ward Cunningham invented Wiki technology and opened it up to the public to advance The Web. Later, Ward Cunningham sought to advance The Web, yet again, by putting Wiki technology on steroids and inventing ["_Smallest Federated Wiki_"](https://github.com/WardCunningham/Smallest-Federated-Wiki/wiki/Hosting-and-Installation-Guide), a way to self-host partials of a collective (federated) wiki across The Web that all rollup into each other with versioning included. This is also a significant advancement of The Web, as it relates to informational content, although Ward archived the Smallest Federated Wiki repository in more recent years.

#### Frameless and Remote Element Definitions
##### The Web as a Library
Remote Element Definitions turn The Web into a reusable WebComponent library for everyone to publish their own Custom Elements and any other content to be consumed by anybody else. Whether that is a static partial for TACs (Term And Conditions) documents or other static content, or a better button, modal, or tooltip -- it allows The Web to become what many have dreamt and lectured that it should become.

##### The Web as a Plugin Architecture
Aside from simply leveraging WebComponents as something of a plugin for any webapp or website, Remote Element Definitions turn The Web into a full Plugin Architecture for Frameless, itself. If a developer needs, say, TypeScript support for scripts in a `.red.html` file, another developer on The Web can create a WebComponent that extends the native `HTMLScriptElement` to allow [all] developers to leverage a `script[type="text/typescrpt"][is="a-better-ts-compiler"]`.

The implications of this are significant. It means that, without even the need to install a package, the entire web becomes a repository for building Frameless plugins, plugins for those plugins, with little to no barrier of entry to publish or consume, all with the same well-established security constraints of The Web that we are all familier with (CORS, etc). **Frameless advances The Web as a convergence of federated wiki technology for WebComponents & static content, a more open-source environment, a better Micro Frontend platform architecture, and "what The Web is supposed to be"**.


## Future Goals & Wishlist
- Performant `script[is="as-typescript"]` element.
- VSCode plugin for syntax highlighting of `.red.html` files.
- Better way to compile REDs, preprocess them with TypeScript, and output their static outputs to bundled or public folders.
- Strongly Slotted `Nodes` nested as `iframe[is="as-frameless"]` (like Weakly Slotted Content).
- Replace entire `<as-red>` element with `<{tagName}>` instead of nesting it.
