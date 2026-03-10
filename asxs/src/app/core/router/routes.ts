
import { Bookmark, Route, Route as Router } from '@asxs/core/router';
import { CatalogElement } from '@app/children/catalog/catalog.element';
import '@app/children/404/404.element';
import '@app/children/home/home.element';

const { log } = console;

export const routes: Route = new Route({
    path: '#',
    name: 'root',
    data: {},
    descendants: [
        // new Route({
        //     path: '',
        //     name: 'home',
        //     data: {},
        //     descendants: [],
        // }),
        new CatalogElement({
            path: 'catalog',
            name: 'catalog',
            data: {},
            descendants: [
                new Bookmark({
                    path: 'test/book/mark',
                    name: 'test',
                    data: {},
                }),
            ],
        }),
        // new Route({
        //     path: '**',
        //     name: 'root:404',
        //     data: {},
        //     descendants: [],
        // }),
    ]
});

Router.init();
log(`@routes`, Router.routes);
