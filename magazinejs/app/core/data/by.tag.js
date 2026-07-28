
import { articles as published } from './by.now.js';

function reduce($, article) {
    const { tags } = article;
    const dictionary = tags.reduce( ($, tag) => refine.call(article, $, tag), $ );
    return dictionary;
}

function refine($, tag) {
    const unique = tag.toLowerCase();  // prevent duplication bases on casing
    const articles = $.getOrInsert(unique, []);
    
    articles.push(this);
    
    return $;
}

export const articles = published.reduce( reduce, new Map() );
