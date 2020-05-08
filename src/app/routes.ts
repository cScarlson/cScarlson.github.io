
import { Router, IRoute } from '@motorman/vertices/sdk/components/router';

var routes = Router.set(new Router('app', [
    // { url: '', name: 'root' },
    // { url: '/route/test/:id', name: 'route-test-id' },
    
    {
        url: '',
        name: 'root',
        children: [
            // { url: '/route/test/:id', name: 'test-id' },
            {
                url: '/route',
                name: 'just-test',
                children: [
                    // { url: '/test/:id', name: 'test-id' },
                    {
                        url: '/test',
                        name: 'just-test',
                        children: [
                            {
                                url: '/0',
                                name: 'ZERO',
                                children: [
                                    { url: '*', name: 'post-id' },
                                ],
                            },
                            {
                                url: '/:id',
                                name: 'just-id',
                                children: [
                                    { url: '*', name: 'post-id' },
                                ],
                            },
                            { url: '*', name: 'no-id' },  // <-- wildcards on parameter-namespaces are useless?
                        ],
                    },
                ],
            },
        ],
    },
    
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
    { url: '*', name: '404' },
]));

export { routes };
