
import { articles } from './by.now.js';

const tags = [ ...articles.reduce( reduce, new Map() ).values() ];

function reduce($, { tags }) {
    return tags.reduce(refine, $);
}

function refine($, tag) {
    const key = tag.toLowerCase();
    return $.set(key, tag);
}

export { tags };

