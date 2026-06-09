
## Dialogs
`dialog[is="as-{type}"]`


### Setup
${setup}

```html
${setup}
```


### Normal
`dialog[is="as-dialog"]`

${normal}

```html
${normal}
```


### Backdrops
`dialog[is="as-dialog"].backdrop.clear`

${backdrop}

```html
${backdrop}
```


### Fullscreen
`dialog[is="as-dialog"].size.fullscreen`

${fullscreen}

```html
${fullscreen}
```


### Conventional
`dialog[is="as-dialog"] > .dialog.body`

${conventional}

```html
${conventional}
```
> _Works with Popover style dialogs as well_.

#### Conventions & Patterns
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

Queued Dialogs leverage a `Queue` data-structure so that the first message to display always remains present until the dialog has been dismissed. Once dismissed, the Queued Dialog simply calls `dequeue` on the queue to show the next message until to queue is empty, at which point it finally closes.

Queued Modals are excellent for implementing Singleton Modals, reducing the DOM footprint by encouraging usage of less dialog instances.

#### Setup

${queued}

```html
${queued}
```

##### Sending Requests

```javascript
${script}
```
> _On click, generates 5 dialog requests (of type "`'as:dialog:request`") and dispatches each one on the dialog instance._

> _NOTE, however, that instead of dispatching an event, in this instance we may as well have called `dialog.showModal(message)`._

> _The Event-Driven dialog request is generally preferred as you may have descendent elements that also trigger a dialog request; in which case, Event Bubbling is a simpler approach to normalize against as it leverages weaker coupling. Also note, the `as-dialog-queue` element's class (`DialogElement`) can be extended to customize its behavior, such as leveraging an EventBus or a Mediator to send dialog requests to the instance._

The Queued Dialog is a great example of how AsXS brings hyper-extensibility to your development flow by preserving the developer's right to opt-in and opt-out when necessary. By simply importing the Custom Element definition, the developer gains additional functionality. This functionality can be easily inherited to subclasses that make it more powerful for your own use-cases. As always, you reserve the option to jailbreak the default behavior of the AsXS SDK and simply define your own element to instantly bootstrap your own desired results. There is no Product Lock-In when it is fully native, hyper-extensible, and always provides an escape hatch.
