
Become A Publisher
================================================================

/magazinejs (or "SlashMag", for short) is a FREE, federated publishing platform. The only barrier to entry, at this time, is having the technical knowledge to build your articles in _RMD_ (Remote Module Definition) format, which is dead simple. However, there are a few rules involved in publishing articles on /magazinejs.


## Requirements
There are minimal requirements to registering and publishing articles. The following are the bare minimum to getting started.
- Own a website.
- <a href="https://cscarlson.github.io/magazinejs/book/demystified/public/040.00.2.thenativemfepattern" target="_blank">Learn The MFE Pattern</a>.
- Provide an `{origin}/magazinejs/index.json` file on your site.
- Contact us on LinkedIn (see "Guidance" below).
- Play nice.
- Optionally, use your favorite embedded ad service in your articles to earn revenue on impressions.


## Rules & Regulations
To publish on SlashMag, you must satisfy the following requirements.


### Violations
Because anyone can post on /magazinejs without a financial barrier, we employ strict policies on violators of the rules below. **We hold a strict policy of a _Max-3_ violation policy. Publishers that reach a _Violation Value_ of `3` or more _will simply be banned from using /magazinejs, FOR LIFE_**. However, it really is not intimidating at all. You can even make several [honest] mistake and not be banned. Publishers only get banned when the violations become egregious. That said, violation assessment and banning are at the sole discretion of the authors & maintainers of the platform.

1. Level 1: accidental platform disruption; usually due to carelessness.
1. Level 2: intentional platform disruption; usually due to attempts to game the system at another publisher's expense.
1. Level 3: excessive disruption; intention to harm users or branding.

Please see below for more information & examples on each violation level.

### Level 1 Violations
#### Example: minor disruptions to the user, the platform, or publishers' content (including yourself)
- Article 404
- Performance impacts
- Careless content (excessive)
- Others deemed by authors as such

#### Strikes Remaining: `2`

### Level 2 Violations
#### Example: intention of Level 1 violations and intention to game systems, users, and publishers.
- Impersonation
- Excessive aggression toward other publishers
- Intentional damage to the platform or publishers
- Others deemed by authors as such

#### Strikes Remaining: `1`

### Level 3 Violations
#### Example: Promotion of Disturbing or Harmful Content
- Pornography (disturbing)
- Violence (disturbing)
- Spam/Scam (harmful)
- Others deemed by authors as such

#### Strikes Remaining: `0` (**ZERO TOLERANCE**)

### Examples of Stikeouts
- 3 Level 1 Violations === `3x1` === `3`
- 2 Level 2 Violations === `2x2` > `3`
- 1 Level 3 Violations === `1x3` === `3`
- 2 Level 1 Violations + any other >= `3`

### Summary
Don't be evil or you'll be banned as soon as it is caught.

### Reporting Mishaps, Misuses & Abuses
Contact <a href="https://www.linkedin.com/in/cody-s-carlson-1b837259" target="_blank">Cody S. Carlson at LinkedIn</a>

<a href="https://www.linkedin.com/in/cody-s-carlson-1b837259" target="_blank">**https://www.linkedin.com/in/cody-s-carlson-1b837259**</a>


## Guidance
Send me a friendly message with your website `origin` for an existing `index.json` schema. I'll simply add it to the registry.

### Website
Where you host your articles is completely up to you. It can be as simple as your GitHub Pages site, an AWS S3 Bucket, or anything else. You own your own content, we just publish it.

### The Native MFE Pattern
Articles must be published in RMD format, which is **easy**. Learn how to <a href="https://cscarlson.github.io/magazinejs/book/demystified/public/040.00.2.thenativemfepattern" target="_blank">implement The Microfrontend Pattern here</a>. This Gang of Four style specification shows how you can create your own microfrontend component **very easily**. In short, `window.frameElement` and `window.parent.customElements`. With that, you can easily create

- Web Components
- Partials/Includes

#### NOTE
_When declaring your RMD iframe in the host, it is recommended to add an `is="as-frameless"` attribute on the iframe. This, whether leveraging the <a href="https://cscarlson.github.io/asxs" target="_blank">AsXS &trade;</a> framework right now or later, allows you to receive automatic updates to your RMDs whenever AsXS updates the `as-frameless` &trade; Custom Element. Otherwise, if wanting those upgrades, you'll have to find all iframes (but only RMDs) and add the attribute later, which may be more costly._

### `index.json`
#### Location Convention
All `index.json` files are assumed to be located at your website's root at `/magazinejs/index.json` (required).

#### Schema
```json
{
    "publisher": "{your-branding}",
    "host": "www.mydomain.name",
    "logo": "{some-image-that-represents-your-publisher-branding}",
    "articles": [ ... ]
}
```
##### Articles
###### Schema
```json
{
    "date": "2026-07-26T21:20:00.000Z",
    "title": "{article-title}; can be [relatively] different/shorter than what shows up in article",
    "subtitle": "{descriptor}",
    "rmd": "{origin}/magazinejs/{topic}/{title}.rmd.html",
    "thumbnail": "{some-image-that-represents-your-article}",
    "authors": [ "Writer/Collaborator 1", "Writer/Collaborator 2", "Writer/Collaborator N" ],
    "tags": [
        "Plugin Architecture",
        "Patterns",
        "Architecture",
        "The Web",
        "Frontend Development",
        "Microfrontend"
    ]
}
```

###### Logo Images
Used for publisher cards on your publisher's page. Can be anything. This can be your favicon or something else. However, if the image imposes performance issues, it could result in a Level 1 violation.

###### Thumbnail Images
Used for article cards on /magazinejs UI. **Use `320px X 320px` dimensions**. Again, the image is up to you. However, **we recommend simply taking a screenshot of your article (viewing it as markdown output, etc) and using that**.

###### Release Date
The date you want the article to be released. Articles get automatically published based on this date. Meaning: you can post articles you are currently working on without them being posted at the time of deployment. Release dates that do not follow the ISO format will be omitted.

###### `article.date`
```javascript
new Date(YYYY, MM, DD, h, m).toISOString();
```
> _Use this to generate your ISO Release Date._


### Registration
You must register your `index.json` file by providing your website's `origin`. All that takes is sending me (Cody Carlson, /magazinejs) a friendly message requesting to be added to the registry. Here's a reasonable format/example.

<a href="https://www.linkedin.com/in/cody-s-carlson-1b837259" target="_blank">Cody S. Carlson @LinkedIn</a>

```
Dear /magazinejs,

Please add me to your registry.
Origin: `https://domain.com`

Thx!

{FirstName} {LastName}
P.S. I primise I'll post articles in good faith so I don't get banned :)
P.P.S. Holler at me if you'd like to discuss any of my articles for your next book or getting out in the wild!
```
> _I will always try to respond in kind and confirm when the new registry has been pushed. Otherwise, posts on my LinkedIn handle may be used to notify all publishers, at once, that a new deployment has been made._


### Environment Considerations
#### Local/Development
All you need for development is a simple Playground area to define an `<iframe>` element that points to your RMD as the source.
#### Live/Production
You should always test to see your article show up on /magazinejs after publishing.

### Tooling
We're working on several bits of tooling that'll make your publishment efforts more streamlined. Please stay tuned but don't let it stop you from getting your word out and recognized!

### One Thing You _Can_ Use
This page uses a _Markdown Helper RMD_, for what it's worth. In fact, if you're seeing this page, it works.

#### Usage
```html
<iframe src="https://cscarlson.github.io/asxs/v2.0.0/markdown/markdown.rmd.html" is="as-frameless" data-src="{origin}/magazinejs/path/to/my/markdown.md"></iframe>
```

### Frameless &trade; `CustomElement`, `customElement`, and Other Utilities
The <a href="https://cscarlson.github.io/asxs" target="_blank">AsXS &trade;</a> SDK provides the _Frameless_ &trade; framework that provides very lightweight utilities for aiding the development of RMDs. These include but are not limited to the following.
- `CustomElement`: a Custom Element baseclass that extends the root document's `HTMLElement` with features like interpolation.
- `customElement`: a TS Decorator style function that safely registers a new Custom Element.
- `TemplateCrawler`: provides functionality for TemplateDirectives like
  -  `+for="let item of data"`
  - `.property="scope.data"`
  - `?boolean-attr="scope.boolean"`

While AsXS may not yet have all utilities documented at this time, please inspect sources through your Webkit Devtools before reaching out to me on LinkedIn.

### Anything Else?
Please reach out if there is anything else you need or want. We would love to help empower you to put your best foot forward.


## Thank You
We are thrilled and can't wait to see what wonderful articles you publish! Please note that I, Cody Carlson, tend to use this website as talking points in various technical discussions and interviews, so, your article might just meet more eyes than you would expect. Please put your best foot forward in your articles :)
