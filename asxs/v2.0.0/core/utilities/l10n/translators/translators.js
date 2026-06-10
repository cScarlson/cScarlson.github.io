
import '/lib/marked.min.js';

const { log } = console;

export const translators = new Set()
    .add(logger)
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
