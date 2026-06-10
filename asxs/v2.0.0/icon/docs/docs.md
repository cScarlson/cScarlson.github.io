
## Icons
`as-icon[strategy="{strategy}"]`

### Setup

#### Choose A Strategy In Your `index.html` File
${setupstrategy}

```html
${setupstrategy}
```

#### Import The RMD
${setupimport}

```html
${setupimport}
```

<style>
    .usage.example {
        display: flex;
        margin-block: var(--size-px-1);
        padding: var(--size-px-2);
        background-color: var(--gray-5);
    }
</style>


### Usage

<div class="usage example">
    ${example}
</div>

```html
${example}
```
> _Icons leverage tagging and fallbacks. That is, each icon type looks at multiple values and, if not found, does its best to provide the icon it believes you are expecting._

### Colors

<div class="usage example">
    ${colors}
</div>

```html
${colors}
```
> _Icons leverage CSS `mask-image` so, naturally, the way to change the color is by using `background-color`._


### Icon `Strategy`
These examples use `strategy="bootstrap-icons"`. However, any icon set can be used if you prefer a different set. In fact, you can even mix & match different strategies. In other words, you can even use the same icon `type` with a different strategy.

#### Example
```html
<as-icon type="list" strategy="bootstrap-icons"></as-icon>
<as-icon type="list" strategy="material"></as-icon>
<as-icon type="list" strategy="iconbuddy.com"></as-icon>
<as-icon type="list" strategy="ascii"></as-icon>
```
> _Using `strategy="ascii"` can leverage ASCII codes as a `::before` or `::after` pseudo-element's `content`, even using CSS `attr(type)` to render the desired icon._

> _NOTE: each icon strategy must be supported through Pull Requests that implement such support -- OR -- literally through your own definitions for any specific website or webapp. This, as always, allows AsXS to provide opt-in and opt-out functionality, where the implementer can jailbreak any `strategy`, without significant overhead._
