
## Buttons
`*[is="as-button"].color.{style}.size.{size}`

### Setup

${setup}

```html
${ escape(setup) }
```

### Types
`[is="as-button"]:is(button, a, label, *)`

${types}

```html
${ escape(types) }
```

### Basic
`*[is="as-button"].color.{style}`

${basic}

```html
${ escape(basic) }
```

### Sizes
`*[is="as-button"].size.{xxs | xs | sm | md | lg | xl | xxl}`

${sizes}

```html
${ escape(sizes) }
```

### Block
`*[is="as-button"].block`

${block}

```html
${ escape(block) }
```

## Stateful
`as-stateful > [is="state"][type="{type}"]:is(*)`

### Setup
None

### Checkbox
`as-stateful > input[is="state"][type="checkbox"]`

${stateful.checkbox}

```html
${ escape(stateful.checkbox) }
```

### Radio
`as-stateful > input[is="state"][type="radio"][name="{name}"]`

${stateful.radio}

```html
${ escape(stateful.radio) }
```

### File Upload
`as-stateful > input[is="state"][type="file"]`

${stateful.files}

```html
${ escape(stateful.files) }
```

### Reflecting State
`*[is="as-button"].color.{style}.size.{x}`

${stateful.reflections}

```html
${ escape(stateful.reflections) }
```
