
${name}
================================================================

JavaScript `BroadcastChannel`s are pretty sweet. MDN<sup>[0]</sup> explains them as...

> "_The Broadcast Channel API allows basic communication between browsing contexts (that is, windows, tabs, frames, or iframes) and workers on the same origin_"

Sounds great. But is it really solving a problem that did not already have a solution? _Kinda_. For most cases I can imagine, there are already solutions for it. The major issue being _cross-context communication_. In other words: when we want one page to communicate to another, but under the same `location.origin`, we can use the following...

- Window Messaging API<sup>[1]</sup>
- Web Workers<sup>[2]</sup>
- Shared Workers<sup>[3]</sup> (unless on mobile)
- WebRTC <sup>[4]</sup>

...alongside other methods involving a server, such as a WebSocket connection. So, again, does this really solve anything we didn't already have a solution to? Yes. It solves the problem of _complexity_. Here's all you really have to do to open a `BroadcastChannel` that will exist between multiple browsing contexts under the same origin...

##### Using Broadcast Channels
```javascript
const channel = new BroadcastChannel('some:channel:name');
channel.addEventListener('message', handler, true);
channel.postMessage({ some: 'data' });
```

Yes, _that_ easy. That said, here are some things to note...

- Any Window under the same origin can open the channel by creating a `new BroadcastChannel` under the same channel name.
- Dispatching on the channel only dispatches to all _other_ contexts but _not_ the same context that dispatched the event.
- It is available to Worker scopes.
- They do not allow Custom Event Types by themselves.

Still, they are very powerful if you need cross-site communication where both share the same origin. Plus, we can remedy some of the minor downsides to using Broadcast Channels. When you need Custom Event Types, simply wrap the channel in a PubSub interface (maybe a good idea to do anyway). When you want the channel to behave as an _EventHub_ that includes communication with the context dispatching a message, leverage the aforementioned PubSub implementation to always _also_ dispatch on a local `EventTarget` before dispatching on the channel (and make `subscribe` do similar). If you are worried about any cross-context channel chatter (say that 3 times), leverage a specific `source` constant that needs to be sent as part of the payload in order for a particular context to have its handlers invoked. This, by the way, is _not_ making it more complex but reducing probable entropy you are likely to experience without a PubSub adapter. In fact, I have done all of these things on this site and it works like a charm.

Here are some good times to use Broadcast Channels...

- You want allow "_basic communication between ... tabs [or] frames_" and share state between them.
- When you don't want to deal with the stumbling blocks around the Window Messaging API.
- When you don't want to connect a Worker just for the sake of intercomm.
- When you don't have too much required chatter between contexts.

Here are some times _not_ to use Broadcast Channels...

- When cross-context chatter is high and you don't want to automate it with one of the "remedies" above.
- You are already connecting a Web Worker and Broadcast Channels are not preferable to use in the Worker.
- You need communication to be mediated and you are not willing to wrap the Broadcast Channel.

To be honest, these are all very nitpicky reasons. I almost cannot see why you would not use them over the alternatives. They are less troublesome than using Window Messaging, less troublesome than managing "_Port Entanglement_" in a SharedWorker, and as much or more easy to setup than a basic Web Worker. Again, _you still have Broadcast Channels available to you within a Worker's scope_.

Again, any "short-comings" are easily remedied by wrapping it in a basic PubSub interface -- which you should likely do in the first place, regardless of the medium underneath (Broadcast Channel(s), Worker, SharedWorker, Window Messaging, `EventTarget`, etc).

Please have a look at the instructions below to see it in action. The example opens a new Window at the Employers Site location. After 3 seconds you should see an alert displaying whatever message was sent.

#### Index
0. Broadcast Channels API: https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API
0. Window Messaging API: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
0. Worker API: https://developer.mozilla.org/en-US/docs/Web/API/Worker
0. SharedWorker API: https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker
0. WebRTC API: https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API
