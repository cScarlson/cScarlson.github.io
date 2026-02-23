
import { RouteElement as Route, Route as Router } from '@asxs/core/router';
import '@app/children/404/404.element';
import '@app/children/home/home.element';
import '@app/children/catalog/catalog.element';

const { log } = console;

export const routes: Route = new Route({
    path: '#',
    name: 'root',
    data: {},
    descendants: [
        new Route({
            path: '',
            name: 'home',
            data: {},
            view: 'at-home',
            descendants: [],
        }),
        new Route({
            path: 'catalog',
            name: 'catalog',
            data: {},
            view: 'at-catalog',
            descendants: [],
        }),
        new Route({
            path: '**',
            name: 'root:404',
            data: {},
            view: 'at-404',
            descendants: [],
        }),
    ]
});
Router.init();
log(`@routes`, Router.routes);
