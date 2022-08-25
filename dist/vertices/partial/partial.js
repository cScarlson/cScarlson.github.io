
import V, {} from '../core.js';

V('partial', function Partial(element) {
    const { attributes } = element;
    var { type, src } = attributes;
    var { value: src } = src;
    var src = src || 'get the source from a docket';
    
    function handleContent(html) {
        element.innerHTML = html;
    }
    
    function init() {
        var content = fetch(src, { 'Content-Type': 'text/html' })
          , content = content.then( res => res.text() )
          , content = content.then(handleContent)
          ;
    }
    
    this.init = init;
    
    return this;
});
