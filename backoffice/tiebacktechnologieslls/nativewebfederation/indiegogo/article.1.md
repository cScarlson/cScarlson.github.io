
Solved: The Web Has Native Partials. Introducing the Remote Module Definition (RMD) Pattern.
================================================================================================================================

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

By building on top of modern, stable web primitives, the Remote Module Definition (RMD) architecture completely answers these legacy constraints. We recognize and honor the monumental efforts of the engineers who paved the way before us, as we firmly solve these structural hurdles and establish a standard for a truly open, framework-free web ecosystem.

## The Origin Of The RMD Pattern: a custom element (Phase 0).

### Custom Element Definition
```javascript
const TAGNAME = 'nwf-partial';
const defined = !!customElements.get(TAGNAME);

if (!defined) customElements.define(TAGNAME, class PartialElement extends HTMLIFrameElement {  // only define if not defined to avoid errors when already defined
    
    #handleLoad(e) {
        const { contentDocument } = this;
        const content = contentDocument.querySelector('.partial.content');  // expects there to be an element such as *[class="partial content"]
        this.outerHTML = content.outerHTML;  // effectively replaces this node with the content of the .partial.content element
    }
    
    handleEvent(e) {
        if (e.type === 'load') return this.#handleLoad(e);  // early return and handle
    }
    
    connectedCallback() {
        this.addEventListener('load', this, true);  // wait for content document & DOM to be established
    }
    
    disconnectedCallback() {  // run cleanups
        this.removeEventListener('load', this, true);  // avoid memory leaks
    }
    
}, { extends: 'iframe' });

```

### Importing The Partial
```html
<div id="container">
    <!-- use [is="nwf-partial"] to extend iframe with our custom element -->
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
    <!-- use [is="nwf-partial"] to extend iframe with our custom element -->
    <div class="partial content">
        <h2>Custom Element Partial</h2>
    </div>
</div>
```

---

## Part 1: Deconstructing The Phase 0 Solution

### The Breakdown
The `PartialElement` simply extends the `HTMLIFrameElement` class so that every instance (`iframe[is="nwf-partial"]`) handles its own scope, as opposed to tracking & mapping everything in a Top-Down system fashion. When the child frame loads, the Custom Element simply queries its own document for the conventional `.content.partial` target before replacing itself with the content, similar to using `this.replaceWith(content)`.

### Limitations
This approach arguably packages the old, Top-Down 'hidden iframes' approach into a single, small system so that there is no complicated mapping & handling between the content source and outlet, largely reducing the chance for errors. But this approach has some issues; while it is no longer a Top-Down system, it is still a Stepwise system in the RMD's outer scope, so the Custom Element must make all kinds of assumptions about the target RMD's inner structure and intentions – essentially, _Content/Pathological Coupling_. In addition to that, the small amount of boilerplate overhead — alongside the aforementioned assumptions — makes this implementation less portable across different codebases without additional tooling (compounding those assumptions). What if we used a Bottom-Up system instead?

---

## Part 2: The RMD Pattern & The Phase 1 Refinement
Essentially, we leverage a type of IoC (Inversion of Control) on the Phase 0 solution by converting the Custom Element into a simplified pattern that flips the system on its head and delegates all assumptions to the partial, itself. Better yet, as you'll see below, we naturally get a fully native _Single File Component (SFC)_ syntax, as seen in the Svelte and Vue frameworks. This natural syntax, however, can be jailbroken if the developer decides to separate code into their own files and import them in the RMD using `script[src]` and `link[href][rel="stylesheet"]` instead. In fact, the RMD pattern even allows you to import `<templates>`s, themselves. Here is a basic RMD and its usage in its simplest form, suited for static partials, without any need for a Custom Element or _any_ additional infrastructure.

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
    <script>  // this can even be a reusable script
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

---

## Part 3: Deconstructing The Phase 1 Solution

### The Breakdown
We delegate all responsibilities & assumptions to the RMD, itself, allowing it to become an _HTML Service_ simply governed by the iframe interface and its own mechanisms. By the time the browser reaches the `<script>`, the RMD simply queries its own document for a target `<template>`, destructures the `DocumentFramement` that is its `content` property, and simply swaps the `iframe` in the _parent frame_ by calling `frameElement.replaceWith` and passing in the document fragment node.

### Limitations
We have yet to come up with many limitations to this pattern at Native Web Federation. It seems to scale in just about every direction you need it to. We've prototyped many variants and plan to explore even more. The Native Web Federation has brought this pattern to scale all the way into entire websites that load quickly and categorically brand new types of web architectures. Other variants we've explored include _Native Skeleton UIs_ where either the host element simply targets the iframes with styles before the frame is replaced, or the RMD, itself, does this on its own `<body>` element. These variants and many more have already been pioneered in our alpha architecture, proving its mechanical viability. We need the community's help on exploring more variants, creating Reference Implementations, building specifications & documentation, and testing & benchmarking this phase alongside each next phase for this pattern.

### Architectural Solutions to the Foundational Questions
The strength of the Remote Module Definition (RMD) pattern lies in its architectural minimalism. Rather than manufacturing a brittle abstraction layer to police these edge cases, the pattern offloads these foundational requirements directly onto the native browser runtime. The web platform's existing specifications inherently resolve these challenges.

#### 1. What happens on runtime or network execution errors?
Because the pattern relies on native browser primitives, network and execution failures trigger standard error lifecycle events automatically. Engineers retain complete programmatic authority to intercept and manage these exceptions according to their application requirements. This can be handled cleanly by unmounting the node from the Document Object Model (DOM) or executing a fallback strategy using a standard inline handler:
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
> _The RMD body automatically receives these styles as it loads, which can even be configured via data-attributes on the `frameElement.dataset`._

#### 3. How are parent and child CSS styles securely scoped and isolated?
Style encapsulation follows standard browser nesting models. Components behave as if authored directly in place, ensuring an intuitive layout flow, and can be complemented by native primitives such as CSS `@scope` rules or _The CDC Pattern_ (see book MagazineJS for spec). The Native Web Federation anticipates that the community will organically extend this primitive into additional diverse subpatterns.

#### 4. What is the lifecycle of JavaScript blocks executed inside the dynamic fragment?
Script execution is divided strictly by behavioral intent:

* Long-Running Processes (LRPs): Persistent structures, such as active event listeners, safely migrate their execution context to the root application shell's head or execute inside a virtual element or dedicated state context.
* Non-Long-Running Processes: Transient scripts execute inside their native environment without requiring any lifecycle tracking whatsoever.

Continued optimization of this script lifecycle boundaries represents a major milestone for our long-term roadmap.

---

## Part 4: Comparing RMD against Modern Frontend Approaches
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

## Part 5: New Web Architectures & New Markets

The mechanical discovery of native partial inclusion is only the beginning. Phases 0 through 6 of the RMD blueprint have already been mechanically proven in our sandbox, laying the groundwork for a broader paradigm shift managed by **Native Web Federation** to gather broader benchmarking data on all phases:

* **Native Partials & Includes (Phase 1):** Inverting layout control so self-contained HTML components mount natively in the DOM — delivering zero-dependency Single File Components without bundlers or build steps. Phase 1 currently has 10+ reference implementation variants already scoped for grants.
* **Native Microfrontends (Phase 2):** Consuming dynamic micro-applications across single-origin or cross-domain networks with zero orchestration frameworks — creating a globally competing, open plugin architecture for the web.
* **True Data Sovereignty (Phase 3):** Reversing the centralized database monopoly by allowing users to house and govern their content natively within their own storage boundaries.
* **Federated Networks (Phase 4):** Enabling decentralized component mirroring and layout remixing across independent websites.
* **Content Domain Name System (CDNS) (Phase 5):** Establishing hybrid routing mechanisms for component lookup, allowing immutable component URLs to resolve geographically closer or localized modules.
* **The Open WebSDK (Phase 6):** Bridging legacy enterprise applications directly into browser-native velocities via standardized web component libraries.

### The Long-Term Vision: W3C Incubation (Phase 7 & 7+)
With Phases 0–6 fully validated, our primary focus shifts to **Phase 7** — formulating formal specification proposals, benchmark data, and C++/WebIDL browser prototypes for a native browser tag (such as a native `<service>` element) to present to open standards bodies like the W3C.

Beyond Phase 7 lies our ultimate target (**Phase 7+**): establishing the Native Web Federation as a permanent **W3C Incubator**. By leveraging the candidate patterns and standardized components built in Phase 6 (The Open WebSDK) as a live production testbed, we can rapidly graduate battle-tested web patterns directly into browser-native standards — dramatically reducing the traditional multi-year delivery timeline from initial platform ideation to core browser implementation.

### The "Dead Internet" Dilemma and CAPTCHA

Additionally, our current research suggests the foundational pattern naturally works as an active signal-jammer to unwanted bots and crawlers, potentially making CAPTCHA a thing of the past and solving the Dead Internet dilemma in defense of content authors & creators.

Successfully mitigating automated network scavenging delivers critical operational, legal, and security protections to both individuals and enterprise organizations:

* **Prevention of Personal Data Loss**: It prevents the automated mining and exposure of sensitive credentials, safeguarding individual digital identity, Personally Identifiable Information (PII), and Protected Health Information (PHI) under strict compliance frameworks like **HIPAA**.
* **Regulatory Readiness**: It introduces an infrastructure-level barrier against automated exfiltration, significantly streamlining organizational compliance reports and audits for frameworks such as **GDPR, SOC2, ISO/IEC 27001**, and the **EU AI Act**.
* **Intellectual Property Protection**: It defends digital assets against un-consented, uncompensated scraping loops used to train proprietary, centralized generative models, securing the sovereign distribution rights of authors and creators.
* **Overhead and Cost Reduction**: It blocks relentless, non-human traffic cycles before they hit centralized infrastructure, drastically lowering compounding bandwidth costs and server processing bills.
* **Secure Layout Handshakes**: To add an unprecedented layer of trust, the architecture facilitates secure, lightweight validation directly at the layout frame layer. By leveraging native interfaces, the system can parse dynamic inputs passed via **URL parameters, iframe attributes, or iframe inner text (structured as raw JSON)**. These payload-driven inputs can securely verify a mutual handshake to handle multi-tiered authentication and context-aware authorization. Because these handshakes process natively rather than relying on interceptable session tokens, they eliminate traditional single-points-of-failure—making the entire web experience safer while potentially making intrusive human/bot tests like **CAPTCHA a thing of the past**.

While automated script engines will inevitably engage in an ongoing, adversarial "cat-and-mouse game" to adapt to this architecture, this pattern establishes the foundational data and benchmarking metrics required to ensure the web remains a free, open, and performant utility for human creators.

Again, all phases have been proofed out already; we are simply seeking Open Standards funding to build out formal specs & docs, reference implementations and variants, tests and benchmarks. But we need _your_ help with preparation for that funding.

---

## Part 6: The Framework Wars & The Broken State of the Web

### The Version Treadmill
Corporate tech giants lock developers into a perpetual loop of framework version wars, forcing engineering teams to waste millions of hours just to keep up with trivial updates. These traditional frameworks war on each other while the developer is caught in the crossfire so that the developer can never truly claim mastery over one framework, move onto mastering or picking up another one or, much less, advancing their skill in the underlying languages that make the framework less important in the first place – all because they are busy chasing new versions with menial advancements.

### The Consequences & Damage
Other than the risk of stalling out their career when the next best framework comes along, all of the artificial state of crisis leads to much worse outcomes that impact the bottom line for both the developer and the organization caught in the crossfire with them. Eventually engineers begin to see some level of burnout, if only from managing the heavy tooling-bloat inherent to the frameworks so they can actually live up to their full promise. Organizations end up having to pay for man-hours to grapple with such unmanageable technical debt and, still, are looking forward to higher enterprise cloud bills and artificial churn on their employees. It's an artificial _Product Stickiness_, and we plan to unstick it to allow native, Open Standards to compete with and overcome the quicksand of proprietary frameworks.

---

## Part 7: The Strategy & The Operational Life Raft
- The Next Step: We are actively moving this from our public alpha playground into our new repository, **Sovereign Commons Distributed**, to create a hardened, production-grade open standard managed by the Native Web Federation (us).
- The Funding Split: We are currently preparing multi-phase research grants for elite digital-commons committees (like NLnet, Mozilla, the Sovereign Tech Fund, and others).
  - The Grant Scope: Institutional funding goes strictly toward future engineering deliverables — writing automated test suites, verifying variants, and recording authoritative performance benchmarks.
  - The Indiegogo Scope: Grant review boards take 3 to 5 months to approve capital. **We need a temporary crowdfunding life raft right now to fund our pre-launch** and publishing setup, cover the marketing costs for our textbook MagazineJS, and keep our three-person team securely housed and operating while the grant pipelines clear.
- More Content to Come: We plan to release more articles as part of this series whenever we've completed each phase of grants & deliverables to keep the community up to date with our discoveries and developments.

<br />
<br />

## 👉 [Back the Indiegogo Campaign: Protect the Team & Secure your Book](https://www.indiegogo.com/en/projects/tiebacktechnologies/nwf?nwfid=live)

## More Resources
- Crowdfunding Campaign: https://www.indiegogo.com/en/projects/tiebacktechnologies/nwf?nwfid=live
- Research/Grants Repository & Phase 1 Predecessor Pattern: https://github.com/nativewebfederation/sovereigncommonsdistributed/tree/main/v1.0.0/phase0
- Native Web Federation: https://nativewebfederation.github.io
- [HTML Imports Specification](https://www.w3.org/TR/html-imports/)
- [(2011) "How To Include One HTML File Into Another"](https://stackoverflow.com/questions/7542872/how-to-include-one-html-file-into-another)

### Respository
- https://github.com/nativewebfederation/sovereigncommonsdistributed

### Alpha Architecture / Playground
- https://cscarlson.github.io/magazinejs/

### MagazineJS (Introductory Field Guide Book) Pre-Order
- https://www.amazon.com/dp/B0HQ5VMK9V

### Cody Carlson
- Website: https://cscarlson.github.io
- LinkedIn: https://www.linkedin.com/in/cody-s-carlson-1b837259
- GitHub: https://github.com/cScarlson

### Julio Parra Sanchez
- Website: https://japs-dev.cloud
- LinkedIn: https://www.linkedin.com/in/julio-parra-sanchez
- GitHub: https://github.com/parrajulio33

### Mike Savino
- LinkedIn: https://www.linkedin.com/in/mike-savino-24579b76
- GitHub: https://github.com/mikesavino85
