
Router RMD
================

## Usage
```html
<as-router>
    <iframe src="/asxs/v2.0.0/router/router.rmd.html" is="as-frameless"></iframe>
    <template>
        <iframe id="/magazinejs/" src="./app/children/home/home.rmd.html" is="as-frameless"></iframe>
        <iframe id="/magazinejs/articles/" src="./app/children/article/collection.rmd.html" is="as-frameless"></iframe>
        <iframe id="/magazinejs/article/" src="./app/children/article/article.rmd.html" is="as-frameless"></iframe>
        <iframe id="/magazinejs/publishers/" src="./app/children/publisher/collection.rmd.html" is="as-frameless"></iframe>
        <iframe id="/magazinejs/join/" src="./app/children/join/join.rmd.html" is="as-frameless"></iframe>
        <iframe id="/magazinejs/about/" src="./app/children/about/about.rmd.html" is="as-frameless"></iframe>
        <iframe id="/magazinejs/404/" src="./app/children/404/404.rmd.html" is="as-frameless"></iframe>
        <iframe id="/magazinejs/{page}/" src="./app/children/about/about.rmd.html" is="as-frameless"></iframe>
        <iframe id="/magazinejs/*/" class="404" src="./app/children/404/404.rmd.html" is="as-frameless"></iframe>
    </template>
</as-router>
```
