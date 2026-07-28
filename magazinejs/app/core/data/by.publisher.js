
import { articles as published } from './by.now.js';

function reduce($, article) {
    const { publisher } = article;
    const collection = $.getOrInsert(publisher, []);
    
    collection.push(article);
    return $;
}

export const articles = published.reduce( reduce, new Map() );
