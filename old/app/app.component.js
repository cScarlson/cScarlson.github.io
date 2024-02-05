
import V, {} from '/vertices/core.js';

const articles = [];
const { log } = console;
const delay = (delay) => new Promise( r => setTimeout(r, delay) );
const fake = () => delay(3_000).then( x => articles );

V('app', 'sandbox', function App($) {
    const thus = this;
    const later = $.querySelector('#later');
    
    function init() {
        const $articles = fetch('/api/v1/content/blog/articles', { headers: { 'Content-Type': 'text/html' } }).then( r => r.json() );
        
        this.on('click', this);
        this.subscribe('child:later:ready', this);
        this.attach(this);
        $articles.then( payload => $.dispatch({ type: 'CONTENT:BLOG:ARTICLES:ACQUIRED', payload }) );
        
        return this;
    }
    
    function handleEvent(e) {
        const { type, data } = e;
        log(`@app.handleEvent`, type, data);
    }
    
    function handleState(state) {
        log(`@app.call`, state);
    }
    
    // export precepts
    this.init = init;
    this.handleEvent = handleEvent;
    this.call = handleState;
    
    return this;
});
