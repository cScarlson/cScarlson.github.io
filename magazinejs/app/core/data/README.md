
CORE DATA
================
This document describes how data is put together, originating from the source, and processes involved. The processes below are actually used to govern business logic and data validation of remote sources to avoid collisions where the author misuses or abuses their schema to game the system at the expense of other authors and the /magazinejs publishing platform.

## Data Curation Cascade
The data originates in the flow seen below. The tree reflects the derivation structure of the data.
```
*[{origin}/magazinejs/index.json]           # absolute source. no derivation
    ├── registry.js                         # derived from all index.json schemata
    ┌───└── schemata.js                     # derived from registry
    ┌───────└── articles.js                 # derived from schemata
    ┌───────────└── by.now.js               # derived from articles
    ┌───────────────└── by.publisher.js     # derived from current articles
    ┌───────────────────└── publishers.js   # derived from articles by publisher
    ┌───────────────└── by.author.js        # derived from articles
    ┌───────────────────└── authors.js      # derived from articles by author
    ┌───────────────└── by.tag.js           # derived from articles
    ┌───────────────────└── tags.js         # derived from articles by tag
    │
    ├── data.js                             # derived from all of the above
    ├── XXXXXXXX.js                         # sample
    │ ─ ┐ ┌ ┘ └ ⊥ ┬ ┴                       # ASCII tooling⊥ 
```

## Registry
### Adding New Publishers/Schemata
AFTER RECEIVING A PUBLISHER'S ORIGIN (URL.prototype.origin), SIMPLY APPEND "/magazinejs/index.json" TO IT. THEN, USE THE HREF'S HOSTNAME (URL.prototype.hostname) AS THE PUBLISHER-ID IN THE EXPORT ("default as {hostname}").

## Schemata
Uses a lowercase key to prevent multiple publishers from having the same publisher-id with only different casing and uses a turnary operator to prevent the violator from dominating the original.

## Articles
Converts the RMD source URL into an ID to prevent duplicate entries of the same article at the same host-RMD location.
