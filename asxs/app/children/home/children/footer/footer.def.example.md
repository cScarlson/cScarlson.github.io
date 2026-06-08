
```html
<body>
    <template>
        ...
    </template>
    <style>
        :host {}
    </style>
    <script type="module">
        import { CustomElement } from 'https://cscarlson.github.io/asxs/v2.0.0/core/element/element.js';
        import { customElement } from 'https://cscarlson.github.io/asxs/v2.0.0/core/element/custom.js';
        
        const { log } = console;
        
        customElement('my-element')
        (class MyElement extends CustomElement {});
    </script>
</body>
```
