
## Dialogs
`dialog[is="as:{type}"]`

### Setup
<style is="as-css-import" target="buttons"></style>

${setup}

```html
${ escape(setup) }
```

### Normal
`dialog[is="as:dialog"]`

${normal}

```html
${ escape(normal) }
```

### Backdrops
`dialog[is="as:dialog"].backdrop.clear`

${backdrop}

```html
${ escape(backdrop) }
```

### Fullscreen
`dialog[is="as:dialog"].size.fullscreen`

${fullscreen}

```html
${ escape(fullscreen) }
```

### Conventional
`dialog[is="as:dialog"] > { .modal.header & .modal.body[method="dialog"]:is(form) & .modal.footer }`

${conventional}

```html
${ escape(conventional) }
```
