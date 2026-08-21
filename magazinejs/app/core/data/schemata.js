
import { registry } from './registry.js';

const ids = Object.keys(registry);
const entries = ids.map( id => registry[id] );
const schemata = [ ...entries.reduce( reduce, new Map() ).values() ];

function reduce($, schema) {  // prevents duplicate publishers 
    const { publisher: id } = schema;
    const unique = id.toLowerCase();  // prevents multiple publishers from having the same publisher-id
    return $.has(unique) ? $ : $.set(unique, schema);  // prevents the violator from dominating the original
}

export { schemata };
