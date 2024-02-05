
import { console, fetch, marked, Handlebars } from '/browserless/core.js';

const { log } = console;
const readmes = new Set([ 'ABOUT:CONTENT', 'PRICING:CONTENT', 'BANNER:FEATURE:CONTENT', 'CONTACT:CONTENT', 'LANDING:CONTENT' ]);

export const translators = new Set()
    .add(logger)
    .add(translateLandingTitle)
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

async function translateLandingTitle(value) {
    if (this.key !== 'LANDING:TITLE') return value;
    const { locale } = this;
    const { [value]: translation } = locale;
    return translation;
}

async function translateMarkdown(value) {
    if ( !readmes.has(this.key) ) return value;
    const response = await fetch(value);
    const contents = await response.text();
    const html = marked.parse(contents);
    
    return html;
}
