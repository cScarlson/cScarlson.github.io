
import '/lib/marked.min.js';

const { console, marked } = window;
const { log } = console;
const readmes = new Set([ 'HERO:CONTENT', 'ABOUT:CONTENT' ]);
const markdowns = new Set([ 'PRICING:TIER:TEXT:0', 'PRICING:TIER:TEXT:1', 'PRICING:RATE:TEXT:0', 'PRICING:RATE:TEXT:1' ]);

export const translators = new Set()
    .add(logger)
    .add(translateReadme)
    .add(translateMarkdown)
    ;

async function logger(value) {
    return value;
    const { key } = this;
    
    log(`@translators#logger`);
    log(`key: "${key}"`);
    log(`value: "${value}"`);
    log(`\n`);
    
    return value;
}

async function translateReadme(value) {
    if ( !readmes.has(this.key) ) return value;
    const { key, locale } = this;
    const response = await fetch(value);
    const contents = await response.text();
    
    locale[key] = contents;  // cache globally for everyone
    readmes.delete(key);  // remove key so that we don't perform the same operation unnecessarily
    markdowns.add(key);  // add key to markdowns so that handler will process it
    
    return contents;
}

async function translateMarkdown(value) {  // NOTE: this could work in tandem with readme handler where readme just fetches, sets markdown to cache, deletes entry from readmes Set, and markdown handler does the rest.
    if ( !markdowns.has(this.key) ) return value;
    const { key, locale } = this;
    const html = marked.parse(value);
    
    locale[key] = html;  // cache globally for everyone
    markdowns.delete(key);  // remove key so that we don't perform the same operation unnecessarily
    
    return html;
}
