
import { articles as all } from './articles.js';

const today = new Date().toISOString();
const articles = all.filter(filter);

function filter({ date }) {
    return (today >= date);
}

export { articles };
