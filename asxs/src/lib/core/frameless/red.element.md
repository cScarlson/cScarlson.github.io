
Remote Element Definition Element
================================================================
This document describes the intention, structure, and behavior of the `as-red` element.

## NOTES
### Leaving the `iframe` in the parent template.
The parent template's original `iframe` must be left in the template as the RED may still be using faculties of the iframe's browsing context long after bootstrapping. That is, console logs, setTimeouts, and others may still be ties to the execution of the original frame from which the RED was extracted.
