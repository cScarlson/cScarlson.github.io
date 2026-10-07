

#### Importing The Partial
#### The App Shell
```html
<div id="container">
    <iframe src="./phase1/partial/partial.rmd.html"></iframe>
</div>
```

#### The Partial (`partial.rmd.html`)
```html
<body>
    <template>
        <p class="terms and conditions">
            lorem ipsum dolor sit amet consectetur adipiscing elit ut labore et in tempore deleniti veniam cumque anim voluptas velit provident consectetur et deserunt repellendus 
            occaecat id temporibus vero harum odio sit quo sint culpa autem cum ut culpa dolor commodo voluptate facilis qui blanditiis occaecat libero accusamus aut fuga excepteur.
        </p>
    </template>
    <script>
        const { content } = document.querySelector('template');
        frameElement.replaceWith(content);
    </script>
</body>
```

#### The Output
```html
<div id="container">
    <p class="terms and conditions">
        lorem ipsum dolor sit amet consectetur adipiscing elit ut labore et in tempore deleniti veniam cumque anim voluptas velit provident consectetur et deserunt repellendus 
        occaecat id temporibus vero harum odio sit quo sint culpa autem cum ut culpa dolor commodo voluptate facilis qui blanditiis occaecat libero accusamus aut fuga excepteur.
    </p>
</div>
```
