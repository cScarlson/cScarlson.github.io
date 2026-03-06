
import { customElement } from '@asxs/core/element';
import { Route } from './route';

const { log } = console;

export const TAGNAME = 'as-route'; 
export @customElement(TAGNAME) class RouteElement extends Route {};