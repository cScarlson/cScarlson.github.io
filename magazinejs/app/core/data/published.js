
import { articles } from './articles.js';

const today = new Date().toISOString();
const published = articles.filter(filter);

function filter({ date }) {
    return (today >= date);
}

export { published };
