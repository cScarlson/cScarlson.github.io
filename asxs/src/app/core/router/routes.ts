
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
                    path: 'variables',
                    name: 'catalog:variables',
                    data: {},
                }),
                new Bookmark({
                    path: 'icons',
                    name: 'catalog:icons',
                    data: {},
                }),
                new Bookmark({
                    path: 'buttons',
                    name: 'catalog:buttons',
                    data: {},
                }),
                new Bookmark({
                    path: 'tooltip',
                    name: 'catalog:tooltip',
                    data: {},
                }),
                new Bookmark({
                    path: 'popover',
                    name: 'catalog:popover',
                    data: {},
                }),
                new Bookmark({
                    path: 'dialogs',
                    name: 'catalog:dialogs',
                    data: {},
                }),
                new Bookmark({
                    path: 'toasts',
                    name: 'catalog:toasts',
                    data: {},
                }),
                new Bookmark({
                    path: 'quickviews',
                    name: 'catalog:quickviews',
                    data: {},
                }),
                new Bookmark({
                    path: 'antitamper',
                    name: 'catalog:antitamper',
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
