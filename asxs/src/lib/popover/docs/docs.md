
## Popovers
`as-popover:has([part~="envelope"])`

### Setup

${setup}

```html
${ escape(setup) }
```

<style>
    .example.action {
        --size: var(--size-px-9);
        --display: flex;
        display: var(--display);
        justify-content: center;
        align-items: center;
        width: var(--size);
        height: var(--size);
        border-radius: var(--radius-2);
        background-color: var(--color-primary);
        font-size: var(--font-size-5);
    }
    .example.popover {
        min-width: 320px;
    }
</style>

### Autodismiss
`as-popover:has([part~="actuator"]):has([part~="envelope"])`

<div style="display: flex; justify-content: space-between; padding: var(--size-px-3)">
    ${autodismiss}
</div>

<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />

```html
${ escape(autodismiss) }
```

#### Discoverable
`as-popover:has([part~="envelope"])`

This type of popover is exactly the same as the autodismiss, however, it has no visible actuator. Instead, the user can tab into the popover canvas, triggering its display. When `as-popover` has no `:focus-within`, it autodismisses itself the same as it otherwise would. This can be useful for content that you only want displayed when tabbing out of a container, or useful Easter Egg content such as for specific environments.

### Toggleable
`as-popover:has([part~="actuator"]):has([part~="envelope"]):has([part~="deactuator"])`

<div style="display: flex; justify-content: space-between; padding: var(--size-px-3)">
    ${toggleable}
</div>

```html
${ escape(toggleable) }
```
> _Notice that the deactuator is not a tabbable element. This allows the deactuator to simply absorb the click action, blurring any elements within the popover that would have provided `:focus-within`._

#### Stateful
`as-stateful > [is="state"] ~ [part~="envelope"]`

A stateful popover that remains open when blurred is easily achieved by making the actuator a stateful button. The only thing left to do from there is simply use a sibling selector to show & hide the popover canvas, based on the state of the stateful button.

```css
as-stateful {
    [is="state"]:checked ~ [part~="envelope"] {
        display: block;
    }
}
```
> _See "Buttons" for more information on stateful elements._
