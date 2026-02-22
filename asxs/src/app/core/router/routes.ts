
import { RouteElement as Route, Route as Router } from '@asxs/core/router';

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
            view: '',
            descendants: [],
        }),
    ]
});
Router.init();
log(`@routes`, Router.routes);
