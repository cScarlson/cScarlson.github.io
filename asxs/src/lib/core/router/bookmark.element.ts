
import { customElement } from '@asxs/core/element';
import { Route } from './route';

const { log } = console;

export const TAGNAME = 'as-internal-bookmark';
export @customElement(TAGNAME) class Bookmark extends Route {
    bookmark: true = true;
};
