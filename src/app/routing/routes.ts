
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
        url: '/app',
        name: 'app',
        content: landing,
        data: { title: 'Welcome' },
        children: [
            {
                url: '/showcase',
                name: 'showcase',
                content: '',
                data: { title: 'Showcase' },
                children: [
                    {
                        url: '/external',  // <embed>s for StackBlitz, GitHub Gists, CodePens, etc.
                        name: 'stackblitz',
                        content: '',
                        data: { title: 'StackBlitz' },
                    },
                    {
                        url: '/features',
                        name: 'features',
                        content: '',
                        data: { title: 'Components' },
                        children: [
                            {   // Note: 404's have to be handled manually
                                // url: '/:id',  // eg: /components/0
                                // url: '/:type',  // eg: /components/hud
                                // url: '/:name',  // eg: /components/hud
                                // url: '/:tagName?title',  // eg: /components/app-hud?title=Heads-Up%20Display
                                url: '/:type',  // eg: /components/hud
                                name: 'feature',
                                content: '',
                                data: { title: 'Component: ${MetaComponent.title}' },
                            },
                        ]
                    },
                ]
            },
            {
                url: '/engineering',  // E-Book section
                name: 'engineering',
                content: '',
                data: { title: 'Software Engineering' },
                children: [
                    {
                        url: '/styleguide',
                        name: 'styleguide',
                        content: '',
                        data: { title: 'Styleguide' },
                    },
                    {
                        url: '/patterns',
                        name: 'patterns',
                        content: '',
                        data: { title: 'Patterns' },
                        children: [
                            {
                                url: '/classical',  // (GoF)
                                name: 'patterns:classical',
                                content: '',
                                data: { title: 'Software Design Patterns' },
                            },
                            {
                                url: '/front-end',
                                name: 'patterns:ui',
                                content: '',
                                data: { title: 'UI/UX Patterns' },
                                children: [
                                    // ...
                                ]
                            },
                        ]
                    },
                    {
                        url: '/principles',
                        name: 'principles',
                        content: '',
                        data: { title: 'Principles' },
                        children: [
                            {
                                url: '/SOLID',
                                name: 'principles:SOLID',
                                content: '',
                                data: { title: 'SOLID Principles' },
                                children: [
                                    {
                                        url: '/:id',  // must handle 404's manually
                                        name: 'SOLID:principle',
                                        content: '',
                                        data: { title: '${id} (${name})' },
                                    },
                                ]
                            },
                            {
                                url: '/design',
                                name: 'principles:design',
                                content: '',
                                data: { title: 'Design Principles' },
                                children: [
                                    {
                                        url: '/PoP',  // most-frequently-used CTA's should be closest to a the CTA which triggered the given menu
                                        name: 'design:PoP',
                                        content: '',
                                        data: { title: 'Principle of Proximity' },
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        url: '/arhitecture',
                        name: 'patterns',
                        content: '',
                        data: { title: 'Patterns' },
                    },
                ]
            },
            {
                url: '/about',
                name: 'about',
                content: '',
                data: { title: 'About' },
                children: [
                    {
                        url: '/experience',  // (displays cropped <embed>/<object> with <a href=".../cody.s.carlson.resume.pdf" download="Cody_S_Carlson-Resume.pdf" target="_blank">)
                        name: 'experience',
                        content: '',
                        data: { title: 'Experience' },
                    },
                ]
            },
            {
                url: '/contact',
                name: 'contact',
                content: '',
                data: { title: 'Contact' },
            },
            {
                url: '/linkin',  // OAuth for LinkedIn & GitHub (logs leads to API)
                name: 'linkin',
                content: '',
                data: { title: 'Link-In' },
            },
        ]
    },
    { url: '/feedback', name: 'feedback', content: '<h1></h1>', data: { title: 'Feedback' } },
    { url: '/aux/auth/token/:platform', name: 'token:platform', content: '<app-user-token-getter></app-user-token-getter>', data: { title: 'Authorizing...' } },
    { url: '/', name: 'root', redirect: '/app' },
    { url: '*', name: '404', content: $404, data: { title: 'Oops!' } },
    
    // { url: '', name: 'root' },
    // { url: '/route/test/:id', name: 'route-test-id' },
    
    
    // {
    //     url: '',
    //     name: 'root',
    //     content: landing,
    //     children: [
    //         // { url: '/route/test/:id', name: 'test-id' },
    //         {
    //             url: '/route',
    //             name: 'just-test',
    //             content: 'at /route',
    //             children: [
    //                 // { url: '/test/:id', name: 'test-id' },
    //                 {
    //                     url: '/test',
    //                     name: 'just-test',
    //                     content: 'at /test',
    //                     children: [
    //                         {
    //                             url: '/0?param',
    //                             name: 'ZERO',
    //                             content: 'at /0?param',
    //                             children: [
    //                                 // { url: '*', name: 'post-id', content: '', },
    //                             ],
    //                         },
    //                         {
    //                             url: '/0',
    //                             name: 'ZERO',
    //                             content: 'at /0',
    //                             children: [
    //                                 // { url: '*', name: 'post-id', content: '', },
    //                             ],
    //                         },
    //                         {
    //                             url: '/:id',
    //                             name: 'just-id',
    //                             content: 'at /:id',
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
    // { url: '*', name: '404', content: $404 },
    
    
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
