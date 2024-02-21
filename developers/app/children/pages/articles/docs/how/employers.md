
How ${name} Was Made
================================================================

As with the marketing site the employers site is a classical SPA where we leverage the CSS `:target` Pseudo Class alongside some CSS Smooth Scroll styling. However, it is much more difficult to get Hash Routes to play nicely with `:target` on a _Horizontal Scroll_ site. The employers site is actually a lot trickier to accomplish than it looks. For one thing, we have the concern of _the menu_.

### The Menu
While the page scrolls (_horizontally_) we need the menu to remain in the same space, visually. The first thought may be to simply apply something similar to the following...

```css
.app.menu {
    position: sticky;
}
```
...and since this is a _horizontal_ scroll site, instead of using `top: 0;`, we can simply use `left: 0;`. NOPE. Interestingly enough, `position: sticky;` _does **not** play well with the x-axis_. So what is the next best thing? In CSS, since a billion years ago, the traditional way of handling something like this was with `position: fixed;`. So we'll go with that.

##### ~~`position: sticky;`~~
```css
.app.menu {
    position: fixed;
    left: 0;
}
```

### The Content
In the end, it saved us a lot of trouble to leverage `display: grid;`, in order to achieve _row-like layout_, as opposed to using `display: flex;` or `display: inline-block`. We basically just need to know how many pages we have and leverage the CSS function `repeat()`.

```css
element {
    --LENGTH: 4;
    grid-template-columns: repeat(var(--LENGTH), 100%);
}
```
Nothing even close to rocket surgery or brain science :-P


### Classical SPA, Internal Links & Bookmarks, and `:target` Elements
The way internal [document] linking works is that, when an internal target is navigated to, the browser attempts to provide the right scroll-offset of both x & y axes top place the target at a relative position of (0, 0). It is clear when working on a horizontal-scoll site that the browser manufacturers never paid too much attention to horizontal scrolling. After all, we have a built-in hash bookmark of `#top` for jumping back to the top of a page but there doesn't seem to be a built-in, say, `#left` for H-scroll sites.

Moreover, all of this generally depends on _scrolling the `body` of a document_, **not** necessarily other containers. So what is one to do if the targets you want to scroll to are inside of elements that are children of `body`? In short: _make them effect the scroll position of `body`_. In a nutshell, here's what we have to do...

### Making <Body> Scrollable With Children
On an H-scroll site, we cannot hide overflow on the x-axis but we do not want scrolling on the child containers. Here's roughly what we're talking about...

##### HTML
```html
<body>
    <app class="app main view"></app>
</body>
```
##### CSS
```css
body {
  &, .app.main.view {
      height: 100vh;
      overflow-y: hidden;
  }
  .app.main.view {
      width: 100vw;
      overflow-x: visible;
  }
}
```

Essentially all we're doing is making sure that both the body and our app container fill 100% of the view-height and clipping off any overflow-y. We then make our app container 100% of the view-width but allow any horizontal overflow to be visible. This forces the content to span out into the document body, which provides us with a horizontal scrollbar in the body. While this _seems_ like all we should need, do not underestimate the browser's determination to do its best to put the scroll target as close to the window's (0, 0) coordinates! Things like _Collapsing Margins_, padding, or other offset dimensions can create abnormalities that surface ugly experiences when the scrolling begins. Other abnormalities bear their ugly head just from offsets created from a window `resize` event.


### Window Resize
It is probably predictable that a window `resize` event could impact a scroll target's offset. It is also probably predictable that we add an event-listener for that event. What might be less predictable is that we use a basic _debounce_ operation to wrap the listener. All the listener does is quickly change the `location.hash` to `#/noop` and then back to `#{current}` in order to invoke the browser's native internal bookmark behavior. Some would advocate leveraging a _throttle_ function instead. While a Throttle would be a fine choice if you wanted to try to keep updating the offset as (say) the user resizes the window -- but without toasting the user's (C/G)PU -- in order to keep the offset as consistent as possible. In the employers site's case we don't really care about that level of consistency -- we just want it to recorrect the offset once, after the window is done resizing -- so a _debounce_ is perfect for our preference. This especially preferred when, generally, the only `resize` event that is likely to fire will be due to a simple portrait-to-landscape orientaion change on a handheld device.


### Summary
It didn't take a degree in particle physics to built the employers site but there were some _very tricky_ tactics we had to pull to get it all to work, without having to go full JavaScript-junky on it -- we still kept our separation of concerns around what should be handled by JS, CSS, and native HTML & browser behavior. That's always a win. Hope you enjoyed learning a little about how the employers site was built and, if you'd like to know more about _sources & methods_, I invite you to send me a link to you team's jobs board -- or feel welcome to dive deeper into the sourcecode yourself :)
