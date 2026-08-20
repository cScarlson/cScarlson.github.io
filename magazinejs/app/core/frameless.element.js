
const { log } = console;
const TAGNAME = 'as-frameless-cors';
const has = !!customElements.get(TAGNAME);

if (!has) customElements.define(TAGNAME, class CrossOriginFramelessElement extends HTMLIFrameElement {
    
    constructor() {
        super();
        const { src } = this;
        const { host } = new URL(src);
        const { host: local } = new URL(location);
        
        if (host !== local) this.src = 'about:blank';  // immediately prevent loading
        if (host !== local) this.#normalize(src);
    }
    
    async #normalize(src) {
        const response = await fetch(src);
        const content = await response.text();
        const blob = new Blob([ content ], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        this.src = url;
    }
    
}, { extends: 'iframe' });
