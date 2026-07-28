
import { articles as published } from './by.now.js';

function reduce($, article) {
    const { authors } = article;
    const dictionary = authors.reduce( ($, tag) => refine.call(article, $, tag), $ );
    return dictionary;
}

function refine($, author) {
    const articles = $.getOrInsert(author, []);
    articles.push(this);
    return $;
}

export const articles = published.reduce( reduce, new Map() );
