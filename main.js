
import './app/constructor.js';

/****
NOTES
- Modules get to decide when, where & how they acquire their templates.
- A basic ES string-template syntax is used for interpolation (create a Utilities module).
- Setting this.innerHTML is basically like calling a "render" function.
- Looping occurs through a <foreach> element (how to get the reference?).
-  - Leverage events/bubbling?
-  - Leverage core utils for (nthGrand)parentElement?
-  - Leverage middleware handlers so people can write their own looping element?
- Services are meant to sit behind a Sandbox.
- Can modules be packaged Svelte style where acquiring a template is acquiring a <template>?
-   - Can this be done with a registered <module[type][url]> module?
- Need core utils for dealing with <slots>.
- Use SDK item for input[[value="x"]]?
- Use SDK item for *[[x="x"]]?
-  - This may likely be the same system that <foreach> uses.
-  - But attribute/property binding was supposed to be performed directly through this.x = x; and this.on('change'); / Event Delegation.
- Use The Arbiter Pattern
****/
