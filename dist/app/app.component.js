
import V, {} from '/vertices/core.js';

const content = [];
const { log } = console;
const delay = (delay) => new Promise( r => setTimeout(r, delay) );
const fake = () => delay(3_000).then( x => content );

V('app', 'sandbox', function App($) {
    const thus = this;
    const later = $.querySelector('#later');
    
    function init() {
        this.on('click', this);
        this.subscribe('child:later:ready', this);
        // this.attach(handleState);
        this.attach(this);
        return this;
    }
    
    function handleContent(content) {
        // log(`@handleContent`, content);
    }
    
    function handleEvent(e) {
        const { type, data } = e;
        log(`@app.handleEvent`, type, data);
    }
    
    function handleState(state) {
        log(`@app.call`, state);
    }
    
    this.after('...app');
    // $.log(`@app`, this, $);
    setTimeout(function tiemout() {
        const html = [
            // `<child:later>`,
            //     `<span slot="header">Laterz</span>`,
            //     `<span slot="">Prefix</span>`,
            //     ` + Another Prefix + `,
            // `</child:later>`,
            `<p></p>`,
        ].join('');
        
        later.innerHTML = html;
        fake().then(handleContent);
        setTimeout(function tiemout() {
            const { firstElementChild } = later;
            later.removeChild(firstElementChild);
        }, (1000 * 10));
    }, (1000 * 3));
    
    // export precepts
    this.init = init;
    this.handleEvent = handleEvent;
    this.call = handleState;
    
    return this;
});
