
import V, {} from '/dist/vertices/core.js';

V('sharable', 'sandbox', function Sharable($) {
    const { attributes } = this;
    const { src: attr } = attributes;
    const { value: src } = attr;
    
    this.src = src;
    this.use('./app/subsystem/sharable/sharable.component.html');
    
    return this;
});

