
import { Router, IRoute } from '@motorman/vertices/sdk/components/router';
import { landing, $404 } from './pages';

/**
 * @TODO new Router(...) should be:
 *  *   exported,
 *  *   imported to ./app,
 *  *   provided in V.configure({...}) -- OR -- V.router(router) sets/pushes router to map/collection -- OR -- use Routes Decorator?
 *  *   and config.bootstrap should call Router.set(router) while
 *  *   *   Router.set should call router.init(director);
 */
var router = new Router('app', [
    {
        url: '',
        name: 'app',
        content: landing,
    },
    { url: '*', name: '404', content: $404 },
    
    // { url: '', name: 'root' },
    // { url: '/route/test/:id', name: 'route-test-id' },
    
    // {
    //     url: '',
    //     name: 'root',
    //     content: '',
    //     children: [
    //         // { url: '/route/test/:id', name: 'test-id' },
    //         {
    //             url: '/route',
    //             name: 'just-test',
    //             content: '',
    //             children: [
    //                 // { url: '/test/:id', name: 'test-id' },
    //                 {
    //                     url: '/test',
    //                     name: 'just-test',content: '',
    //                     children: [
    //                         {
    //                             url: '/0',
    //                             name: 'ZERO',
    //                             content: '',
    //                             children: [
    //                                 { url: '*', name: 'post-id', content: '', },
    //                             ],
    //                         },
    //                         {
    //                             url: '/:id',
    //                             name: 'just-id',
    //                             content: '',
    //                             children: [
    //                                 { url: '*', name: 'post-id', content: '', },
    //                             ],
    //                         },
    //                         { url: '*', name: 'no-id', content: '', },  // <-- wildcards on parameter-namespaces are useless?
    //                     ],
    //                 },
    //             ],
    //         },
    //     ],
    // },
    
    // {
    //     url: '',
    //     name: '',
    //     data: {},
    //     children: [
    //         { url: '/childA', name: 'Child-A' },
    //         { url: '/childB', name: 'Child-B' },
    //         { url: '/childC/:id', name: 'Child-C' },
    //         {
    //             url: '/childD',
    //             name: 'Child-D',
    //             children: [
    //                 { url: '/grandchildA', name: 'Grandchild-A' },
    //             ],
    //         },
    //     ],
    // },
    // {
    //     url: '/noop',
    //     name: '',
    //     data: {},
    //     children: [
    //         { url: '/childA', name: 'Child-A' },
    //         { url: '/childB', name: 'Child-B' },
    //         { url: '/childC/:id', name: 'Child-C' },
    //         {
    //             url: '/childD',
    //             name: 'Child-D',
    //             children: [
    //                 { url: '/grandchildA', name: 'Grandchild-A' },
    //             ],
    //         },
    //     ],
    // },
    // { url: '/signup', name: 'signup' },
    // { url: '*', name: '404' },
]);
Router.set(router);

export { router };
