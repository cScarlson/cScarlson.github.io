
import { articles as all } from './articles.js';

const today = new Date().toISOString();;

function filter({ date }) {
    return (today >= date);
}

export const articles = all.filter(filter);
export const $articles = articles.reduce( ($, article) => $.set(article.id, article), new Map() );
