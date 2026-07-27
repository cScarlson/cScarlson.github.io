
import { published } from './published.js';

const authors = published.reduce( reduce, new Map() );

function reduce($, article) {
    const { authors } = article;
    const dictionary = authors.reduce( ($, author) => refine.call(article, $, author), $ );
    return dictionary;
}

function refine($, author) {
    const authors = $.getOrInsert(author, []);  // prevent duplication bases on casing
    authors.push(this);
    return $;
}

export { authors };
