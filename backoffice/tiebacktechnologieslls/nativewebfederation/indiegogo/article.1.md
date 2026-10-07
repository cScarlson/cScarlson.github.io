
Solved: The Web Has Native Partials. Introducing the Remote Module Definition (RMD) Pattern.
================================================================================================================================

## TL;DR, The Discovery.
For decades, web developers have complained about the lack of native, zero-dependency browser partials and serverless includes. We were told we needed heavy third-party framework compilation layers just to slice code layout efficiently.

We were told wrong.

The **Remote Module Definition (RMD)** pattern removes this bottleneck natively inside the browser’s raw engine. By returning to first principles, we have turned the web into an open plugin architecture — eliminating framework technical debt, restoring data sovereignty, and setting the baseline for entirely new web architectures and new web markets. Here is the code executing natively today:

## A Brief (Yet Decades-Long) History
The challenge of native component inclusion is not new; the web development community has been trying to solve this bottleneck for over thirty years. This persistent dilemma dates back to early server-side architectures and client-side hacks of the 1990s and 2000s, including Apache Server Side Includes (SSI), the highly controversial frameset era, and primitive patterns involving hidden iframes.
By the early 2010s, the conversation shifted to community Q&A forums, where developers frequently sought clean patterns for template injection. A notable milestone occurred around 2013 when the W3C introduced the HTML Imports specification — arguably the industry's most coordinated attempt at a native solution. Despite initial enthusiasm and widespread documentation across community hubs, the specification failed to gain universal browser consensus and was officially deprecated in 2023.
The industry's long-standing demand for a native, element-driven layout inclusion mechanism has historically stalled whenever specifications encounter the same four foundational questions:

1. What happens on runtime or network execution errors?
2. How are delayed loading and asynchronous hydration states managed?
3. How are parent and child CSS styles securely scoped and isolated?
4. What is the lifecycle of JavaScript blocks executed inside the dynamic fragment?

By building on top of modern, stable web primitives, the Remote Module Definition (RMD) architecture completely answers these legacy constraints. We recognize and honor the monumental efforts of the engineers who paved the way before us, as we firmly solve these structural hurdles and establish a standard for a truly open, framework-free web ecosystem.

### The Origin Of The RMD Pattern: a custom element (Phase 0).

#### Custom Element Definition
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

#### Importing The Partial
```html
<div id="container">
    <!-- use [is="nwf-partial"] to extend iframe with our custom element -->
    <iframe src="./phase0/customelement/customelement.rmd.html" is="nwf-partial"></iframe>
</div>
```

#### The Partial
```html
<body>
    <div class="partial content">
        <h2>Custom Element Partial</h2>
    </div>
</body>
```

#### Output
```html
<div id="container">
    <!-- use [is="nwf-partial"] to extend iframe with our custom element -->
    <div class="partial content">
        <h2>Custom Element Partial</h2>
    </div>
</div>
```

## Part 1: Deconstructing The Phase 0 Solution

### The Breakdown
The `PartialElement` simply extends the `HTMLIFrameElement` class so that every instance (`iframe[is="nwf-partial"]`) handles its own scope, as opposed to tracking & mapping everything in a Top-Down system fashion. When the child frame loads, the Custom Element simply queries its own document for the conventional `.content.partial` target before replacing itself with the content, similar to using `this.replaceWith(content)`.

### Limitations
This approach arguably packages the old, Top-Down 'hidden iframes' approach into a single, small system so that there is no complicated mapping & handling between the content source and outlet, largely reducing the chance for errors. But this approach has some issues; while it is no longer a Top-Down system, it is still a Stepwise system in the RMD's outer scope, so the Custom Element must make all kinds of assumptions about the target RMD's inner structure and intentions – essentially, _Content/Pathological Coupling_. What if we used a Bottom-Up system instead?

### Part 2: The RMD Pattern & The Phase 1 Refinement
Essentially, we leverage a type of IoC (Inversion of Control) on the Phase 0 solution by converting the Custom Element into a simplified pattern that flips the system on its head and delegates all assumptions to the partial, itself. Better yet, as you'll see below, we naturally get a fully native _Single File Component (SFC)_ syntax, as seen in the Svelte and Vue frameworks. This natural syntax, however, can be jailbroken if the developer decides to separate code into their own files and import them in the RMD using `script[src]` and `link[href][rel="stylesheet"]` instead. In fact, the RMD pattern even allows you to import `<templates>`s, themselves. Here is a basic RMD and its usage in its simplest form, suited for static partials, without any need for a Custom Element or _any_ additional infrastructure.

#### Importing The Partial
```html
<div id="container">
    <iframe src="./phase1/partial/partial.rmd.html"></iframe>
</div>
```

#### The Partial
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

#### Output
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
We delegate all responsibilities & assumptions to the RMD, itself, allowing it to become an _HTML Service_ simply governed by the iframe interface and its own mechanisms. By the time the browser reaches the `<script>`, the RMD simply queries its own document for a target `<template>`, destructures the `DocumentFramement` that is its `content` property, and simply swaps the `iframe` in the _parent frame_ by calling `frameElement.replaceWith` and passing in the document fragment node.

### Limitations
We have yet to come up with many limitations to this pattern at Native Web Federation. It seems to scale in just about every direction you need it to. We've prototyped many variants and plan to explore even more. The Native Web Federation has brought this pattern to scale all the way into entire websites that load quickly and categorically brand new types of web architectures. Other variants we've explored include _Native Skeleton UIs_ where either the host element simply targets the iframes with styles before they are replaced, or the RMD, itself, does this on its own `<body>` element. These variants and many more have already been pioneered in our alpha architecture, proving its mechanical viability. We need the community's help on exploring more variants, creating Reference Implementations, building specifications & documentation, and testing & benchmarking this phase alongside each next phase for this pattern.


### Architectural Solutions to the Foundational Questions
The strength of the Remote Module Definition (RMD) pattern lies in its architectural minimalism. Rather than manufacturing a brittle abstraction layer to police these edge cases, the pattern offloads these foundational requirements directly onto the native browser runtime. The web platform's existing specifications inherently resolve these challenges.

#### 1. What happens on runtime or network execution errors?
Because the pattern relies on native browser primitives, network and execution failures trigger standard error lifecycle events automatically. Engineers retain complete programmatic authority to intercept and manage these exceptions according to their application requirements. This can be handled cleanly by unmounting the node from the Document Object Model (DOM) or executing a fallback strategy using a standard inline handler:
```html
<iframe onerror="e => this.src='404.html'">
```
#### 2. How are delayed loading and asynchronous hydration states managed?
Asynchronous state orchestration is handled gracefully via standardized visual states. The architecture provides two validated methodologies to manage network latency and layout shifts using native Skeleton UI subpatterns. These patterns ensure a fluid user experience during remote layout fetching without depending on heavy client-side state machines.
#### 3. How are parent and child CSS styles securely scoped and isolated?
Style encapsulation follows standard browser nesting models. The components behave exactly as if their contents were authored directly in place, ensuring an intuitive layout flow. The Native Web Federation anticipates that the community will organically extend this primitive into diverse subpatterns, such as utilizing _The CDC Pattern_ (see book MagazineJS) or leveraging native browser @scope rules.
#### 4. What is the lifecycle of JavaScript blocks executed inside the dynamic fragment?
Script execution is divided strictly by behavioral intent:

* Long-Running Processes (LRPs): Persistent structures, such as active event listeners, safely migrate their execution context to the root application shell's head or execute inside a virtual element or dedicated state context.
* Non-Long-Running Processes: Transient scripts execute inside their native environment without requiring external lifecycle tracking whatsoever.

Continued optimization of this script lifecycle boundaries represents a major milestone for our long-term roadmap.

## Part 3: The Framework Wars & The Broken State of the Web

### The Version Treadmill
Corporate tech giants lock developers into a perpetual loop of framework version wars, forcing engineering teams to waste millions of hours just to keep up with trivial updates. These traditional frameworks war on each other while the developer is caught in the crossfire so that the eveloper can never truly claim mastery over one framework, move onto mastering or picking up another one or, much less, advancing their skill in the underlying languages that make the framework less important in the first place – all because they are busy chasing new versions with menial advancements.

### The Consequences & Damage
Other than the risk of stalling out their career when the next best framework comes along, all of the artificial state of crisis leads to much worse outcomes that impact the bottom line for both the developer and the organization caught in the crossfire with them. Eventually engineers begin to see some level of burnout, if only from managing the heavy tooling-bloat inherent to the frameworks so they can actually live up to their full promise. Organizations end up having to pay for man-hours to grapple with such unmanageable technical debt and, still, are looking forward to higher enterprise cloud bills and artificial churn on their employees. It's an artificial _Product Stickiness_, and we plan to unstick it to allow native, Open Standards to compete with and overcome the quicksand of proprietary frameworks.

## Part 4: New Web Architectures & New Markets
We haven't just solved the native partial constraint; we have used the RMD blueprint to go way further. The technical implementations of these advanced layers remain inside our unvetted playground & alpha architecture which has successfully proofed out every single phase beyond what this article covers:

- **Native Microfrontends (Phase 2)**: Consuming MFEs across a single origin's network with zero heavy infrastructure or orchestration tools, alongside consuming MFEs across nodes in a cross-domain network and effectively turning the entire web into an open, globally competing Plugin Architecture.
- **True Data Sovereignty (Phase 3)**: Reversing the database monopoly. Users entirely own, house, and govern their content natively on their own storage boundary, allowing corporate systems to consume user content in a simple way even before the need to stack a server behind it to write directly to the user’s host, based on simple conventions or input.
- **Federated Networks (Phase 4)**: A new type of Web Architecture that, in part, realizes Ward Cunningham’s Smallest Federated Wiki concept across any platform layout. Websites can natively point back to, mirror, or selectively edit layers of each other's content & components for their own flavor of what those should be.
- **The Content Domain Name Server (CDNS) (Phase 5)**: A simple, new type of web architecture acting as a source of truth and a hybrid between a CDN (Content Delivery Network) and a DNS (Domain Name Server) for individual web component lookup — allowing for stabile URLs to be inspected and dynamically route geographically closer, localized, or internationalized components from stabile, immutable addresses. Organizations can create their own CDNS systems for their own commercial purposes.
- **The Open WebSDK (Phase 6)**: An incredibly extensible, native SDK framework built to bridge proprietary legacy apps directly into native browser velocities.
- **Native W3C Specification Proposal (Phase 7)**: With our demonstrations, tests, specifications & documentation and benchmark data in hand, we are empowered to work with other Open Standards bodies like the W3C to propose specifications they can adopt and facilitate browser manufacturers to implement native elements that provide such functionality in the most streamlined ways. We plan to prototype all of this into a real native Webkit or Blink tagName that allows all the functionality & discovery to exist as a working W3C element that can be easily handed over to browsers to be implemented. We are HTML and JavaScript experts – not experts in WebIDL (Interface Definition Language), the bridge between JavaScript and C++. Funding for this phase will go into AI and employment for a head specialist to help us literally make all of the above come completely true with a single tagName for the `<service>` element. We can make this happen for once and for literally all. The Web deserves better. Developers deserve better. The world has been waiting long enough for this and more.

In anticipation of Phase 7 we are confident that, as a highly comfortable stretch goal, we can solve all these with pure HTML/JS & Open Standards and, at most, a tiny set of Custom Elements that will be part of the Open Standard _and_ be fully & freely available for any use; they will be accessible even by pointing to the raw file on GitHub. Any & all Custom Elements will be part of our Phase 7 W3C Specification proposal, rolled into a single native element.

Additionally, our research will cover whether or not the foundational pattern naturally works as an active signal-jammer to unwanted bots and crawlers, potentially making CAPTCHA a thing of the past and solving the Dead Internet dilemma in defense of content authors & creators. More to come of that but, suffice to say, the Native Web Federation believes new frameworks, new businesses & markets will form on top of our Open Standards once funding has supported the necessary development, specifications & documentation and benchmarking necessary to facilitate this new paradigm.

Again, all phases have been proofed out already; we are simply seeking Open Standards funding to build out formal specs & docs, reference implementations and variants, tests and benchmarks. But we need _your_ help with preparation for that funding.

## Part 5: The Strategy & The Operational Life Raft
- The Next Step: We are actively moving this from our public alpha playground into our new repository, **Sovereign Commons Distributed**, to create a hardened, production-grade open standard managed by the Native Web Federation (us).
- The Funding Split: We are currently preparing multi-phase research grants for elite digital-commons committees (like NLnet, Mozilla, the Sovereign Tech Fund, and others).
  - The Grant Scope: Institutional funding goes strictly toward future engineering deliverables — writing automated test suites, verifying variants, and recording authoritative performance benchmarks.
  - The Indiegogo Scope: Grant review boards take 3 to 5 months to approve capital. **We need a temporary crowdfunding life raft right now to fund our pre-launch** and publishing setup, cover the marketing costs for our textbook MagazineJS, and keep our three-person team securely housed and operating while the grant pipelines clear.
- More Content to Come: We plan to release more articles as part of this series whenever we've completed each phase of grants & deliverables to keep the community up to date with our discoveries and developments.

<br />
<br />
<br />

# 👉 [Back the Indiegogo Campaign: Protect the Team & Secure your Book](XXXXXXXX-TODO-XXXXXXXX)
# 🧪 [Inspect the RMD Phase 0 Reference Code Live inside Sovereign Commons Distributed](https://github.com/nativewebfederation/sovereigncommonsdistributed/tree/main/v1.0.0/phase0)

## More Resources
- [HTML Imports Specification](https://www.w3.org/TR/html-imports/)
- [(2011) "How To Include One HTML File Into Another"](https://stackoverflow.com/questions/7542872/how-to-include-one-html-file-into-another)

#### Respository
- https://github.com/nativewebfederation/sovereigncommonsdistributed

#### Alpha Architecture / Playground
- https://cscarlson.github.io/magazinejs

#### MagazineJS
- https://cscarlson.github.io/src/app/children/book/cover/design.rmd.html

#### Cody Carlson
- Website: https://cscarlson.github.io
- LinkedIn: https://www.linkedin.com/in/cody-s-carlson-1b837259
- GitHub: https://github.com/cScarlson

#### Julio Parra Sanchez
- Website: https://japs-dev.cloud
- LinkedIn: https://www.linkedin.com/in/julio-parra-sanchez
- GitHub: https://github.com/parrajulio33

#### Mike Savino
- LinkedIn: https://www.linkedin.com/in/mike-savino-24579b76
- GitHub: https://github.com/mikesavino85
