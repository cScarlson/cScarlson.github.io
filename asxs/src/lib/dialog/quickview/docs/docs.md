
## Quickview Dialogs
`dialog[is="as-dialog"][modus="quickview"]`

AsXS Quickviews (A.K.A. "Offcanvas Views") piggyback on AsXS Dialogs. Therefrom, you can leverage the same patterns to achieve what you need, including making them a Queued Dialog.

### Setup

${setuphtml}

```html
${ escape(setuphtml) }
```

#### Queued
```typescript
${ escape(setupts) }
```

### Basic
`dialog[is="as-dialog"][modus="quickview"]`

${basic}

```typescript
${ escape(basic) }
```
> _These examples use `.backdrop.clear` as a preference._

> _`[position]` can be used with both Popover style and Command style triggers._

#### Queued
`dialog[is="as-dialog-queue"][modus="quickview"]`

