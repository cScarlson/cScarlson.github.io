
import { customElement } from '@asxs/core/element';
import { Route } from './route';

const { log } = console;

export const TAGNAME = 'as-route-x';
export @customElement(TAGNAME) class RouteElement extends Route {};