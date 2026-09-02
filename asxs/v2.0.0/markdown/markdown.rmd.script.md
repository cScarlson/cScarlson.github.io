
Markdown RMD Script (RMDS)
================================================================
This document outlines the definition & usage of the RMDS utility.

## Purpose
This RMDS allows RMD developers to inject this script to automatically pull in contents of a markdown file while providing a template to which the parsed markdown will be interpolated alongside an optional scope for interpolating data into the markdown, itself.

## Usage

### RMD
```html
<body>
    <template>
        <style>
            pre {
                padding: var(--size-px-2);
                color: var(--green-5);
                background-color: var(--gray-10);
                overflow-x: auto;
                scrollbar-width: none;
            }
        </style>
        <p>The following is an example article, written in Markdown...</p>
        ${content}
    </template>
    <script id="markdown" type="application/json">
        {
            "url": "/path/to/markdown/markdown.md"
        }
    </script>
    <script id="scope" type="application/json">
        {
            "subtitle": "It Worked"
        }
    </script>
    <script src="/asxs/v2.0.0/markdown/markdown.rmd.script.js" type="module"></script>
</body>
```

### Example `/path/to/markdown/markdown.md`
```markdown
Some Title
================

## ${subtitle}
```

### RMD Template Output
```html
<body>
    <template>
        <style>
            pre {
                padding: var(--size-px-2);
                color: var(--green-5);
                background-color: var(--gray-10);
                overflow-x: auto;
                scrollbar-width: none;
            }
        </style>
        <p>The following is an example article, written in Markdown...</p>
        <h1>Some Title<h1>
        <h1>It Worked<h1>
    </template>
    <script id="markdown" type="application/json">
        {
            "url": "/path/to/markdown/markdown.md"
        }
    </script>
    <script id="scope" type="application/json">
        {
            "subtitle": "It Worked"
        }
    </script>
    <script src="/asxs/v2.0.0/markdown/markdown.rmd.script.js" type="module"></script>
</body>
```

## Details
- `markdown.rmd.script.js` should be of `[type="module"]`
- `scope` is optional
- `[id="markdown"]` expects a `url`
- `markdown.rmd.script.js` automatically calls `frameElement.replaceWith(template.content)`

## ToDo's
- allow jailbreaking "`markdown.rmd.script.js` automatically calls `frameElement.replaceWith(template.content)`" for other usecases like Custom Elements.
