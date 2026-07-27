
CORE DATA
================
This document describes how data is put together, originating from the source, and processes involved. The processes below are actually used to govern business logic and data validation of remote sources to avoid collisions where the author misuses or abuses their schemata to gain the system at the expense of other authors and the /magazinejs publishing platform.

## Data Curation Cascade
The data originates in the flow seen below.
```
[{origin}/magazinejs/index.json]
    ├── registry.js                 # aggregates all index.json data
        ├── publishers.js           # ...
            ├── articles.js         # ...
                ├── published.js    # omits articles with a future release date
                    ├── tags.js     # returns a JavaScript Map whose keys can be used for building menus
    ├── data.js                     # aggregates all exports
```

## Registry
### Adding New Publishers
AFTER RECEIVING A PUBLISHER'S ORIGIN (URL.prototype.origin), SIMPLY APPEND "/magazinejs/index.json" TO IT. THEN, USE THE HREF'S HOSTNAME (URL.prototype.hostname) AS THE PUBLISHER-ID IN THE EXPORT ("default as {hostname}").

## Publishers
Uses a lowercase key to prevent multiple publishers from having the same publisher-id with only different casing and uses a turnary operator to prevent the violator from dominating the original.

## Articles
Uses the RMD source URL to prevent duplicate entries of the same article.
