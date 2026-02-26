
Loop
================
Using a `Loop` to repeat templates.


## Basic
###### `**/*.element.ts`
```typescript
export const TAGNAME = 'some-element';
export @customElement(TAGNAME) class SomeElement extends CustomElement {
    get ['as:state']() {
        const { id } = this;
        const items = new Loop([
            { id: 'test0', title: 'Title 0', data: { test: 'TEST' } },
            { id: 'test1', title: 'Title 1', data: { test: 'TEST' } },
            { id: 'test2', title: 'Title 2', data: { test: 'TEST' } },
            { id: 'test3', title: 'Title 3', data: { test: 'TEST' } },
        ]).with("<li>(${id}) ${this.title}: ${data.test}</li>");
        
        return { id, items };
    }
};
```
> _The template passed into `.with` is for example only. Always import the template (using `?raw`) unless it will always exist as a simple one-liner._
###### `**/*.element.html`
```html
<ul>${items}</ul>
```
### Output
```html
<ul>
    <li>(test0) Title 0: TEST</li>
    <li>(test1) Title 1: TEST</li>
    <li>(test2) Title 2: TEST</li>
    <li>(test3) Title 3: TEST</li>
</ul>
```
> _Interpolation works using both `${key}` or `${this[key]}`._

## Advanced

### Accessing Parent Scope Data
```typescript
export const TAGNAME = 'some-element';
export @customElement(TAGNAME) class SomeElement extends CustomElement {
    id: number = 100;
    get ['as:state']() {
        const { id } = this;
        const items = new Loop([
            { id: 'test0', title: 'Title 0', data: { test: 'TEST' } },
            { id: 'test1', title: 'Title 1', data: { test: 'TEST' } },
            { id: 'test2', title: 'Title 2', data: { test: 'TEST' } },
            { id: 'test3', title: 'Title 3', data: { test: 'TEST' } },
        ]).with("<li>(${id}) ${this.title} - parent ID: ${this['as:state'].id}</li>").use(this);
        
        return { id, items };
    }
};
```
### Output
```html
<ul>
    <li>(test0) Title 0 - parent ID: 1000</li>
    <li>(test1) Title 1 - parent ID: 1000</li>
    <li>(test2) Title 2 - parent ID: 1000</li>
    <li>(test3) Title 3 - parent ID: 1000</li>
</ul>
```

#### Changing The Parent Scope Namespace
```typescript
export const TAGNAME = 'some-element';
export @customElement(TAGNAME) class SomeElement extends CustomElement {
    id: number = 100;
    get ['as:state']() {
        const { id } = this;
        const items = new Loop([
            { id: 'test0', title: 'Title 0', data: { test: 'TEST' } },
            { id: 'test1', title: 'Title 1', data: { test: 'TEST' } },
            { id: 'test2', title: 'Title 2', data: { test: 'TEST' } },
            { id: 'test3', title: 'Title 3', data: { test: 'TEST' } },
        ]).with("<li>(${id}) ${this.title} - parent ID: ${this['@parent'].id}</li>").use(this, '@parent');
        
        return { id, items };
    }
};
```
### Output
```html
<ul>
    <li>(test0) Title 0 - parent ID: 1000</li>
    <li>(test1) Title 1 - parent ID: 1000</li>
    <li>(test2) Title 2 - parent ID: 1000</li>
    <li>(test3) Title 3 - parent ID: 1000</li>
</ul>
```

#### Accessing The Array Index
```typescript
export const TAGNAME = 'some-element';
export @customElement(TAGNAME) class SomeElement extends CustomElement {
    get ['as:state']() {
        const { id } = this;
        const items = new Loop([
            { id: 'test0', title: 'Title 0', data: { test: 'TEST' } },
            { id: 'test1', title: 'Title 1', data: { test: 'TEST' } },
            { id: 'test2', title: 'Title 2', data: { test: 'TEST' } },
            { id: 'test3', title: 'Title 3', data: { test: 'TEST' } },
        ]).with("<li>[${this['as:index']}] (${id}) ${this.title}</li>");
        
        return { id, items };
    }
};
```
### Output
```html
<ul>
    <li>[0] (test0) Title 0</li>
    <li>[1] (test1) Title 1</li>
    <li>[2] (test2) Title 2</li>
    <li>[3] (test3) Title 3</li>
</ul>
```

#### Accessing The Array
```typescript
export const TAGNAME = 'some-element';
export @customElement(TAGNAME) class SomeElement extends CustomElement {
    get ['as:state']() {
        const { id } = this;
        const items = new Loop([
            { id: 'test0', title: 'Title 0', data: { test: 'TEST' } },
            { id: 'test1', title: 'Title 1', data: { test: 'TEST' } },
            { id: 'test2', title: 'Title 2', data: { test: 'TEST' } },
            { id: 'test3', title: 'Title 3', data: { test: 'TEST' } },
        ]).with("<li>(${id}) ${this['as:loop'][3].title}</li>");
        
        return { id, items };
    }
};
```
### Output
```html
<ul>
    <li>(test0) Title 3</li>
    <li>(test1) Title 3</li>
    <li>(test2) Title 3</li>
    <li>(test3) Title 3</li>
</ul>
```

#### Accessing The Next Item From The Previous
If you want to render data in the current iteration within the previous iteration, you can add interpolation syntax to the data you display.

```typescript
export const TAGNAME = 'some-element';
export @customElement(TAGNAME) class SomeElement extends CustomElement {
    get ['as:state']() {
        const { id } = this;
        const items = new Loop([
            { id: 'test0', title: 'Title 0 - ${title}', data: { test: 'TEST' } },
            { id: 'test1', title: 'Title 1', data: { test: 'TEST' } },
            { id: 'test2', title: 'Title 2 - ${title}', data: { test: 'TEST' } },
            { id: 'test3', title: 'Title 3', data: { test: 'TEST' } },
        ]).with("<li>(${id}) ${title");
        
        return { id, items };
    }
};
```
### Output
```html
<ul>
    <li>(test0) Title 0 - Title 1</li>
    <li>(test1) Title 1</li>
    <li>(test2) Title 2 - Title 3</li>
    <li>(test3) Title 3</li>
</ul>
```
> _This works because the interpolation algorithm reinterpolates the entire current template upon each iteration, so the next iteration will find interpolation syntax in it after the previous._

## Altogether
```typescript
export const TAGNAME = 'some-element';
export @customElement(TAGNAME) class SomeElement extends CustomElement {
    id: number = 1000;
    get ['as:state']() {
        const { id } = this;
        const items = new Loop([
            { id: "test0-${this['as:index']}", title: 'Title 0 AND ${title}', data: { test: 'TEST' } },
            { id: "test1-${this['as:index']}", title: 'Title 1', data: { test: 'TEST' } },
            { id: "test2-${this['as:index']}", title: 'Title 2', data: { test: 'TEST' } },
            { id: "test3-${this['as:index']}", title: 'Title 3', data: { test: 'TEST' } },
        ]).with("<div>[${this['as:index']}](${id}) ${this.title} - (${this['as:state'].id}) - (${this['as:loop'][0].id})</div>").use(this);
        
        return { id, items };
    }
};
```
### Output
```html
<ul>
    <li>[0](test0-1) Title 0 AND Title 1 - (1000) - (test0-1)</li>
    <li>[1](test1-2) Title 1 - (1000) - (test0-2)</li>
    <li>[2](test2-3) Title 2 - (1000) - (test0-3)</li>
    <li>[3](test3-${this['as:index']}) Title 3 - (1000) - (test0-${this['as:index']})</li>
</ul>
```
> _The final line gets "`[3](test3-${this['as:index']}) Title 3 - (1000) - (test0-${this['as:index']})`" as its output because_
- it is the last iteration.
- `${this['as:loop'][0].id}` accesses the current iteration's `id`, which simply replaces the interpolation sytax with more interpolation sytax.
- like above, it replaces `${id}` with the id, which is "`test3-${this['as:index']}`".
