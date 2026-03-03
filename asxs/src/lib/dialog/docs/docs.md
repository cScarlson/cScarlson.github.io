
## Dialogs
`dialog[is="as-{type}"]`


### Setup
<style is="as-css-import" target="dialogs"></style>

```html
${ escape(setup) }
```


### Normal
`dialog[is="as-dialog"]`

${normal}

```html
${ escape(normal) }
```


### Backdrops
`dialog[is="as-dialog"].backdrop.clear`

${backdrop}

```html
${ escape(backdrop) }
```


### Fullscreen
`dialog[is="as-dialog"].size.fullscreen`

${fullscreen}

```html
${ escape(fullscreen) }
```


### Conventional
`dialog[is="as-dialog"] > { .dialog.header & .dialog.body[method="dialog"]:is(form) & .dialog.footer }`

${conventional}

```html
${ escape(conventional) }
```

#### Patterns
Patterns generally follow the _Class Domain-Chaining_ (CDC) pattern (see more in "Styleguides").

##### `dialog[is="as-dialog"] > *`
 - header: `position: sticky; top: 0`
 - footer: `position: sticky; bottom: 0`
 - body: `HTMLFormElement`
 

##### `dialog[is="as-dialog"] > .dialog.header .header.action.close`
If added, automatically receives focus and can be used for manual dismission of the dialog.

##### `dialog[is="as-dialog"] > .dialog.body[method="dialog"]:is(form)`
Conventionally, the dialog body is a form element. This allows `button[type="submit"]` actions to be wired up to the form to automatically dismiss the dialog when the action is performed. See below for more information.

##### `dialog[is="as-dialog"] > * button[type="submit"][formaction="{type}"]`
All submission buttons tied to the dialog's form will automatically dismiss the dialog. However, you can use `formaction`s to signal to a submission handler which action was performed. In cases where you want to preserve the dialog (not exit), your handler can simply implement `SubmitEvent.prototype.preventDefault` method to prevent its dismissal.


### Queued Dialog
`dialog[is="as-dialog-queue"]`

Queued Dialogs leverage a `Queue` data-structure so that the first message to display always remains present until the dialog has been dismissed. Once dismissed, the Queued Dialog simply calls `dequeue` on the queue until to queue is empty, at which point it finally closes.

Queued Modals are excellent for implementing Singleton Modals, reducing the DOM footprint by encouraging usage of less dialog instances.

#### Setup

```typescript
${ escape(setup) }
```

${queued}

```html
${ escape(queued) }
```

##### Sending Requests
```javascript
${ escape(script) }
```
