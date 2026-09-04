
import { Article } from './article.model.js';
import { schemata } from './schemata.js';

const articles = [ ...schemata.reduce( reduce, new Map() ).values() ];

function reduce($, entity) {
    const { articles } = entity;
    const models = articles.reduce( ($, article) => refine.call(entity, $, article), $ );
    return models;
}

function refine($, article) {
    const { publisher, host } = this;
    const model = new Article({ ...article, publisher, host });
    return $.set(model.id, model);
}

export { articles };
