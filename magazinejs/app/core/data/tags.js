
import { published } from './published.js';

const tags = published.reduce( reduce, new Map() );

function reduce($, article) {
    const { tags } = article;
    const dictionary = tags.reduce( ($, tag) => refine.call(article, $, tag), $ );
    return dictionary;
}

function refine($, tag) {
    const unique = tag.toLowerCase();
    const articles = $.getOrInsert(unique, []);  // prevent duplication bases on casing
    
    articles.push(this);
    
    return $;
}

export { tags };
