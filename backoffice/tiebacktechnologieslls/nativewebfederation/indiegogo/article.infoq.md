# Solved: The Web Has Native Partials. Introducing the Remote Module Definition (RMD) Pattern.

## TL;DR, The Discovery.

For decades, web developers have complained about the lack of native, zero-dependency browser partials and serverless includes. We were told we needed heavy third-party framework compilation layers just to slice code layout efficiently.

We were told wrong.

The **Remote Module Definition (RMD)** pattern removes this bottleneck natively inside the browser’s raw engine. By returning to first principles, we have turned the web into an open plugin architecture — eliminating framework technical debt, restoring data sovereignty, and setting the baseline for entirely new web architectures and new web markets. Here is the code executing natively today:

## First, A Brief (Yet Decades-Long) History

The challenge of native component inclusion is not new; the web development community has been trying to solve this bottleneck for over thirty years. This persistent dilemma dates back to early server-side architectures and client-side hacks of the 1990s and 2000s, including Apache Server Side Includes (SSI), the highly controversial frameset era, and primitive patterns involving hidden iframes.

By the early 2010s, the conversation shifted to community Q&A forums, where developers frequently sought clean patterns for template injection. A notable milestone occurred around 2013 when the W3C introduced the HTML Imports specification — arguably the industry's most coordinated attempt at a native solution. Despite initial enthusiasm and widespread documentation across community hubs, the specification failed to gain universal browser consensus and was officially deprecated in 2023.

The industry's long-standing demand for a native, element-driven layout inclusion mechanism has historically stalled whenever specifications encounter the same four foundational questions:

1. What happens on runtime or network execution errors?
2. How are delayed loading and asynchronous hydration states managed?
3. How are parent and child CSS styles securely scoped and isolated?
4. What is the lifecycle of JavaScript blocks executed inside the dynamic fragment?

By building on top of modern, stable web primitives, the Remote Module Definition (RMD) architecture answers these legacy constraints. We recognize and honor the monumental efforts of the engineers who paved the way before us, as we firmly solve these structural hurdles and establish a standard for a truly open, framework-free web ecosystem.

## The Origin Of The RMD Pattern: A Custom Element (Phase 0)

### Custom Element Definition

```javascript
const TAGNAME = 'nwf-partial';
const defined = !!customElements.get(TAGNAME);

if (!defined) customElements.define(TAGNAME, class PartialElement extends HTMLIFrameElement {  
    
    #handleLoad(e) {
        const { contentDocument } = this;
        const content = contentDocument.querySelector('.partial.content');  
        this.outerHTML = content.outerHTML;  
    }
    
    handleEvent(e) {
        if (e.type === 'load') return this.#handleLoad(e);  
    }
    
    connectedCallback() {
        this.addEventListener('load', this, true);  
    }
    
    disconnectedCallback() {  
        this.removeEventListener('load', this, true);  
    }
    
}, { extends: 'iframe' });

```

### Importing The Partial

```html
<div id="container">
    <iframe src="./phase0/customelement/customelement.rmd.html" is="nwf-partial"></iframe>
</div>

```

### The Partial

```html
<body>
    <div class="partial content">
        <h2>Custom Element Partial</h2>
    </div>
</body>

```

### Output

```html
<div id="container">
    <div class="partial content">
        <h2>Custom Element Partial</h2>
    </div>
</div>

```

## Part 1: Deconstructing The Phase 0 Solution

### The Breakdown

The `PartialElement` simply extends the `HTMLIFrameElement` class so that every instance (`iframe[is="nwf-partial"]`) handles its own scope, as opposed to tracking & mapping everything in a top-down system fashion. When the child frame loads, the Custom Element simply queries its own document for the conventional `.content.partial` target before replacing itself with the content (`this.outerHTML = content.outerHTML`).

### Limitations

This approach packages the old, top-down hidden-iframe approach into a smaller system, largely reducing mapping errors. However, it is still a stepwise system in the outer scope, requiring the Custom Element to make assumptions about the target RMD's inner structure — essentially introducing *Content/Pathological Coupling*. What if we used a bottom-up system instead?

## Part 2: The RMD Pattern & The Phase 1 Refinement

By leveraging Inversion of Control (IoC) on the Phase 0 solution, we convert the Custom Element into a simplified pattern that flips the system on its head and delegates all structural assumptions to the partial itself. This yields a fully native *Single File Component (SFC)* syntax, as seen in modern component frameworks, without any build-time tooling. Here is a basic RMD and its usage in its simplest form, suited for static partials:

### Importing The Partial

```html
<div id="container">
    <iframe src="./phase1/partial/partial.rmd.html"></iframe>
</div>

```

### The Partial

```html
<body>
    <template>
        <style>
            .my.heading {
                color: blue;
            }
        </style>
        <h2 class="my heading">Native Partial</h2>
    </template>
    <script>  
        const { content } = document.querySelector('template');
        frameElement.replaceWith(content);
    </script>
</body>

```

### Output

```html
<div id="container">
    <style>
        .my.heading {
            color: blue;
        }
    </style>
    <h2 class="my heading">Native Partial</h2>
</div>

```

## Part 3: Deconstructing The Phase 1 Solution

### The Breakdown

We delegate all responsibilities to the RMD itself, allowing it to become an *HTML Service* governed by the iframe interface and its local mechanisms. By the time the browser reaches the `<script>`, the RMD queries its own document for a target `<template>`, destructures the `DocumentFragment` from its `content` property, and swaps the `iframe` in the parent frame by calling `frameElement.replaceWith`.

### Limitations

Architectural benchmarking across diverse web applications indicates strong scalability. Prototype variants include *Native Skeleton UIs* where host elements apply placeholder styles before frame replacement, or where the RMD manages its own loading state directly on the `<body>` element. Ongoing community testing continues to validate these variants and reference implementations.

### Architectural Solutions to the Foundational Questions

The strength of the Remote Module Definition (RMD) pattern lies in its architectural minimalism. Rather than manufacturing a brittle abstraction layer, the pattern offloads foundational requirements directly onto the native browser runtime.

#### 1. What happens on runtime or network execution errors?

Network and execution failures trigger standard error lifecycle events automatically. Engineers retain complete programmatic authority to intercept and manage exceptions according to application requirements via standard inline handlers:

```html
<iframe onerror="e => this.src='404.rmd.html'">

```

#### 2. How are delayed loading and asynchronous hydration states managed?

Asynchronous state orchestration is handled gracefully via standardized visual states using native Skeleton UI subpatterns, ensuring a fluid user experience during remote layout fetching without heavy client-side state logic:

```html
<body>
    <template>...</template>
    <style>
        body {
            min-height: 120px;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: rmd-shimmer 1.5s infinite;
        }

        @keyframes rmd-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
    </style>
    <script>...</script>
</body>
```

#### 3. How are parent and child CSS styles securely scoped and isolated?

Style encapsulation follows standard browser nesting models. Components behave as if authored directly in place, complemented by native primitives such as CSS `@scope` rules.

#### 4. What is the lifecycle of JavaScript blocks executed inside the dynamic fragment?

Script execution is divided strictly by behavioral intent:

* **Long-Running Processes (LRPs):** Persistent structures, such as active event listeners, migrate their execution context to the root application shell's head or execute within a dedicated state context.
* **Non-Long-Running Processes:** Transient scripts execute inside their native environment without requiring lifecycle tracking whatsoever.

---

## Part 3: The Framework Wars & The Broken State of the Web

### The Version Treadmill

Ecosystem churn locks developers into a perpetual loop of framework version updates, forcing engineering teams to spend valuable cycles managing trivial upgrades rather than mastering underlying platform primitives.

### The Consequences & Damage

This artificial complexity results in unnecessary tooling bloat, higher enterprise cloud infrastructure bills, and increased engineering fatigue. Adopting native open standards helps reduce framework technical debt and aligns development efforts with stable browser capabilities.

---

## Part 4: Advanced Architectures & Open Standards

Beyond basic partial inclusion, the RMD blueprint scales across advanced architectural patterns:

* **Native Microfrontends (Phase 2):** Consuming microfrontends across a single origin or cross-domain network without heavy orchestration tools, turning the web into an open plugin architecture.
* **True Data Sovereignty (Phase 3):** Enabling users to house and govern content natively on their own storage boundaries, allowing client systems to consume user content via simple conventions.
* **Federated Networks (Phase 4):** Realizing decentralized component sharing where websites can mirror or selectively reference external layout components.
* **The Content Domain Name Server (CDNS) (Phase 5):** A hybrid routing model for individual web component lookup, enabling stable URLs to resolve geographically closer localized components.
* **The Open WebSDK (Phase 6):** Bridging legacy applications directly into native browser velocities via standardized web components.
* **Native W3C Specification Proposal (Phase 7):** Working toward standardized W3C specification proposals for native browser element tags that support streamlined component inclusion.

Additionally, browser-isolated fragment execution introduces natural structural resistance against automated web scrapers and unauthorized data harvesting, protecting creator content without intrusive user tests like CAPTCHA.

---

## Part 5: Comparing RMD against Modern Frontend Approaches

To evaluate the operational impact of adopting the Remote Module Definition pattern, we compare its trade-offs against conventional frontend architectures:

| Feature / Metric | Traditional SPA (React / Vue) | Micro-Frontends (Module Federation) | RMD Pattern (Native RMD) |
| --- | --- | --- | --- |
| **Build-Time Tooling** | Required (Babel, Vite, Webpack) | Heavy (Custom Webpack plugins) | **None** (Vanilla Browser Standards) |
| **Runtime Overhead** | Heavy (Virtual DOM + Runtime Libs) | Moderate-High (Shared Runtime Wrappers) | **Zero** (Native Engine Primitives) |
| **Node.js Dependency Tree** | Hundreds of MBs (`node_modules`) | Complex shared dependency matrices | **Zero External Dependencies** |
| **Component Syntax** | Non-standard JSX / `.vue` files | Standard JS / Framework-specific | **Native HTML / CSS / JS** |
| **Dynamic Origin Loading** | Complex CORS / Bundle Splitting | Complex Remote Entry Configuration | **Native `<iframe src="...">` Primitives** |
| **Debugging Experience** | Requires Source Maps & DevTools | Complex Cross-Bundle Stack Traces | **Direct Browser DOM Inspection** |

---

## Conclusion

The Remote Module Definition pattern demonstrates that modern web standards have matured to a point where client-side component inclusion, dynamic module fetching, and layout slicing no longer require build infrastructure to achieve. By leveraging simple, fundamental browser primitives — `<iframe>`, `<template>`, and basic DOM manipulation — RMD delivers a robust, zero-dependency alternative to heavy framework toolchains.

As browser engines continue to advance native capabilities like CSS `@scope`, custom element registries, and standard ES modules, architecture paradigms that align with the native platform will consistently outperform heavy synthetic abstraction layers in maintainability, performance, and long-term durability.
