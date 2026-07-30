
Does Import Attribute Type JSON Replace Fetch GET?
================================================================
A New Way To Access Data

## What Are Import Attributes
In case this one happened to slip by you, <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with" target="_blank">Import Attributes</a> are a newly available spec for `imports` that allow you to annotate & assert what the _MIME Type_ of the source is. This allows you to import JSON files as JavaScript objects without having to parse the data. In the future, we will also have similar for plain text. Here's what a JSON MIME Type attribute looks like.

```javascript
import { default as data } from 'some/source/data.json' with { type: 'json' };
```

When `with { type: 'text' }` is supported, this will unlock the ability to easily and natively import your own HTML templates, Markdown documentation (empowering Playgrounds & Catalogs), and other uses. However, at this time, only `application/json` and `text/css` are supported.

## 'Synchronous' Network Calls for JSON Data
While building _this site_ (/magazinejs) it became apparent that you can use `type: 'json'` for acquiring data, not just from configurations within your own site or across The Web, but you [theoretically] should be able to make the same request against a server API endpoint to retrieve data, similar to how you would use `fetch(url, { method: 'GET' })`.

### The Practical Difference
The main difference is that, with `fetch`, you are coupled to an _asynchronous_ opereration whereas, with `import`, you are virtually looking at a _synchronous_ operation. Technically, this is still probably untrue but, for practical purposes, it feels synchronous to your modules.

#### Cardinal Data
While you still may want to retrieve your data using `fetch` most of the time, I can see using `import` for it being very handy for _Cardinal Data_. That is, data that _must_ be pulled down first before the website or webapp can feasibly be considered useful. For example, once an OAuth PKCE protocol has been satisfied, the application root can simply import things like _user permissions_, _UI-config data_, _recent state_, or other data. The server simply waits for a request at `**/*.json` and **serves a JSON file containing records it retrieved from the database**.

## Closing Thoughts
OK, the title bore some clickbait in it, but it was a good excuse to talk about this other methodology that might influence the architecture of your UI; heck, it might influence the architecture of your entire enterprise. In reality, it should probably only ever be used for Cardinal Data or in other special cases. In other words: **it does _not_ replace `fetch/GET` but it can certainly make your life a lot easier/synchronous at times you really need it**. In fact, there are namely two technical concepts that make the /magazinejs _Distributed Publishing Platform_ practical: this methodology and The Microfrontend Pattern.
