
## Variables
AsXS leverages <a href="https://open-props.style" target="_blank">OpenProps</a>, so you get what we get. Additionally, AsXS provides a few shortcuts that you may likely find useful. Moreover, these shortcuts can also be overridden as you would with any other global CSS variables on `:root`/`html`.

### Setup

```typescript
${setup}
```

<style>
    * { box-sizing: border-box }
    .shortcuts.example {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: var(--size-8);
        margin-block: var(--size-px-2);
        border: solid 5px transparent;
        border-radius: var(--radius-2);
        background-image: linear-gradient(to right, var(--gray-12), var(--gray-0), var(--gray-0), var(--gray-12));
        background-clip: border-box;
        background-origin: border-box;
        background-repeat: no-repeat;
        &::before {
            content: attr(data-example);
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            background-color: inherit;
            font-size: var(--font-size-2);
            font-weight: var(--font-weight-7);
        }
    }
</style>

### Variables
<a href="https://open-props.style" target="_blank">https://open-props.style</a>


### Shortcuts

${example}

```html
${ escape(example) }
```
