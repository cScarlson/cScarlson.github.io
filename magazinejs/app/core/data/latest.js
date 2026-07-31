
import { articles } from './by.now.js';
export const latest = articles.sort(sort).slice(0, 6);

function sort({ date: a }, { date: b }) {
    if (a > b) return  1;
    if (a < b) return -1;
    return 0;
}
