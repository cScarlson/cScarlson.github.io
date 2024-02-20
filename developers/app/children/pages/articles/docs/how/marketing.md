
How ${name} Was Made
================================================================

Generally, the marketing site leverages all APIs from the _Web Components_ family -- Custom Elements, Templates, Shadow DOM, etc. Within that, things like <a href="https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals" target="_blank">_Internals_</a> for, say, tracking whether or not the form has been `:--submitted` are also a benefit. On the marketing site, the Custom Elements API is wrapped in order to give us a little bit more control over things such as registering _Attribute Directives_. A good example of an attribute directive is, say, a `submitOn` directive. A submitOn directive could be used as so...

### Example Directive: `submitOn`

##### HTML
```html
<form submiton="some:event:channel"></form>
```
##### JavaScript
```javascript
const anywhereInTheApp = {
    handleSomeDetachedProcess(e) {
        sandbox.publish('some:event:channel', fromCache); // programatically submits the form through an Event-Bridge via the submit-on directive
    }
};
```

While many other useful examples may come to mind for an attribute directive one might want, this tends to be a rather useful one.

### Example Component
In a nutshell, a component implements _The Revealing Module Pattern_ in JavaScript. Here is a very basic example...

##### The Revealing Module Pattern
```javascript
const module = (function Module() {
    const hidden = [];
    const exposed = {};
    
    function private() {}
    function public() {
        private();
    }
    
    return {
        exposed,
        public,
    };
})();
```

In the marketing site, it might look like this...

```javascript
import { f, console } from '/browserless/core.js';

f('my-component', function MyComponent(element) {
    
    return {
        metadata: {
            template: '<h1>My Component Title</h1>',
            styles: 'h1 { text-transform: uppercase; }'
        },
        connectedCallback() {},
        disconnectedCallback() {}
    };
});
```

Here is a more proper, working example of a component definition in the framework from the marketing site...
```javascript
import { f, console } from '/browserless/core.js';
import { metadata as meta } from '/browserless/kit/decorators/metadata.js';

const { log } = console;
const metadata = {
    ...meta,
    template: './src/app/children/component/component.html',
    styles: './src/app/children/component/component.css',
};

f('my-component', metadata, Sandbox, { call = $ => $ });
```
This is all it really takes to define a component. This is because the framework leverages _Decorators_ (`metadata`, `Sandbox`, [more if you want] ). In fact, the component definition itself (`{ call = $ => $ }`) is actually just another decorator. The framework basically just looks at a registration-function's signature as something like this: `function f(tagName, ...decorators) {...}`. Because it expects all `...dectorators` to either be a `function` or and object with a `call` method, we could have also written it like this...

```javascript
f('my-component', metadata, Sandbox, function MyComponent($) {
    return $;
});
```

The reason we are `return`ing `$` is simply because the framework expects a final result that resumbles the interface below...

```typescript
interface IDecoratorOutput {
    metadata: {
        template: string;
        styles: string;
    }
}
```
Where `template` is the actual `innerHTML` to be placed inside of the component and `styles` as the literal _CSS Rules_ to be placed within a `<style>` element. At the end of the day, `Sandbox` implements the interface above and so all we have to do for a simple component is return it.

The best part about this framework is that virtually _everything_ has been 'asynchrofied'. That means every decorator can use `async/await` for the execution of its `call` method (`function`s naturally have one), for the return of its `metadata` definition, for the value of its `template`, and also for the value of its `styles`. This allows both components and decorators (to split that hair) the ability to `fetch` its template, styles, metadata, or entire definition from wherever it wants if necessary.


### I18n/L10n Ready
The marketing site leverages _locale files_ at its base. All content is stored in JSON files that get translated. However, no library was pulled in to aid in translations because _creating an L10n translation system is so easy_. Here is essentially all it takes...

##### `browserless/core/kit/l10n/translator.js`
```javascript
const dialects = {
    'en-US': 'en',
};

class Translator {
    language = 'en-US';
    dialect = dialects[this.language];
    locales = { };
    locale = this.locales[this.dialect];
    translators = new Set();
    
    constructor(options = {}) {
        const { locales, translators } = { ...this, ...options };
        const { navigator } = window;
        const { language } = navigator;
        const dialect = dialects[language];
        const locale = locales[dialect];
        
        this.language = language;
        this.dialect = dialect;
        this.locale = locale;
        this.translators = translators;
        
        return this;
    }
    
    translate = async (key) => {
        const { locale, translators } = this;
        const { [key]: value } = locale;
        const promise = Promise.resolve(value);
        const translation = await [ ...translators ].reduce( async (p, fn) => await fn.call({ key, locale }, await p), promise );
        
        return translation;
    };
    
}

export { Translator };
```


##### `src/app/core/utilities/translate.js`
```javascript
import { Translator } from '/browserless/kit/l10n/translator.js';
import { translators } from '/src/app/core/utilities/translators/translators.js';
import { default as en } from '/src/app/locales/en.locale.js';

const locales = { en, es: en };
const { translate } = new Translator({ locales, translators });

export { translate };
```


##### `src/app/core/utilities/translators/translators.js`
```javascript
import { console, fetch, marked, Handlebars } from '/browserless/core.js';

const { log } = console;
const readmes = new Set([ 'ABOUT:CONTENT', 'PRICING:CONTENT', 'BANNER:FEATURE:CONTENT', 'CONTACT:CONTENT', 'LANDING:CONTENT' ]);

export const translators = new Set()
    .add(logger)
    .add(translateLandingTitle)
    .add(translateMarkdown)
    ;

async function logger(value) {
    return value;  // mute
    const { key } = this;
    
    log('@translators#logger', key, value);
    
    return value;
}

async function translateLandingTitle(value) {
    if (this.key !== 'LANDING:TITLE') return value;
    const { locale } = this;
    const { [value]: translation } = locale;
    return translation;
}

async function translateMarkdown(value) {
    if ( !readmes.has(this.key) ) return value;
    const response = await fetch(value);
    const contents = await response.text();
    const html = marked.parse(contents);
    
    return html;
}
```


##### `src/app/locales/en.locale.json`
```json
{
    "": "",
    "undefined": "",
    "BRAND:NAME": "Pop Sites!",
    "LANDING:TITLE": "BRAND:NAME",
    "LANDING:SUBTITLE": "Need a Web Presence? We can help!",
    "LANDING:CONTENT": "./src/app/locales/landing.en.md"
}
```

##### `**/anywhere.js`
```
import { translate } from 'src/app/core/utilities/translate.js';

(async function () {
    const translation = await translate('SOME:KEY');
})();
```

The translation system was accomplished in basically 3 files -- the largest of which was only `40` Lines Of Code (if even). In fact, it was more like that `1` sole file because _translators_ are optional and you're always going to need your `{lang}.locale.json` files. The other file under `**/utilities` is simply to instantiate a singleton.


##### Translators Are Nice to Have
The translators list (`Set`) is very helpful when...

- you need to _map to an entire README file_ for content
- you need to _handle dynamic text interpolations_ within the translation text
- any other special treatment based on one or more _target keys_

That is basically as complicated as it gets. You can even use it to implement nested structures -- although, **nested locale file structures is a terrible idea** and _you should simply leverage fully-qualified key-names_ as seen above.

## Summary
While there may be more in this document to talk about -- nifty little hacks, awesome patterns, did-you-know-about subjects -- this just about covers the meat & potatoes of the marketing site. Hope you enjoyed learning a little bit about it, please feel free to explore the source as much as (politely) possible, and feel welcome to get a hold of me and let me know your thoughts or connect over some other interest.
