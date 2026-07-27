
import { Article } from './article.model.js';
import { publishers } from './publishers.js';

const articles = [ ...publishers.reduce( reduce, new Map() ).values() ];

function reduce($, entity) {
    const { articles } = entity;
    const models = articles.reduce( ($, article) => refine.call(entity, $, article), $ );
    return models;
}

function refine($, article) {
    const { publisher, origin } = this;
    const { rmd } = article;
    const model = new Article({ ...article, publisher, origin });
    
    return $.set(rmd, model);  // prevent duplicate entries of the same article
}

export { articles };
