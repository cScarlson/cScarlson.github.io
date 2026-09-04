
const TAGNAME = 'mag-7f5dee90-12f1-4ded-9eca-91b68e228c5f';
const has = !!customElements.get(TAGNAME);

console.log(`@REMOTE#CustomElement#Experiment`, customElements, HTMLElement);

if (!has) customElements.define(TAGNAME, class SlashMagCloudflareTest extends HTMLElement {
    
    connectedCallback() {
        this.innerHTML = `<h1>Hellow Cloudflare</h1>`;
    }
    
});
else console.log(`@REMOTE#has#not`, TAGNAME, customElements.get(TAGNAME));
