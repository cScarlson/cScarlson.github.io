
export default {
    path: '#',
    name: 'root',
    children: [
        {
            path: '',
            name: 'app',
            target: './app/children/pages/home/home.html',
        },
        {
            path: 'tooling/ascii',
            name: 'tooling:ascii',
            target: './app/children/pages/ascii/ascii.html',
            children: []
        },
        {
            path: 'articles/how/developers',
            name: 'articles:how:developers',
            target: './app/children/pages/articles/readme/readme.html',
            data: { name: 'developers', doc: './app/children/pages/articles/docs/how/developers.md' },
            children: []
        },
        {
            path: 'articles/how/marketing',
            name: 'articles:how:marketing',
            target: './app/children/pages/articles/readme/readme.html',
            data: { name: 'marketing', doc: './app/children/pages/articles/docs/how/marketing.md' },
            children: []
        },
        {
            path: 'articles/how/employers',
            name: 'articles:how:employers',
            target: './app/children/pages/articles/readme/readme.html',
            data: { name: 'employers', doc: './app/children/pages/articles/docs/how/employers.md' },
            children: []
        },
        {
            path: 'articles/how/broadcast',
            name: 'articles:how:broadcast',
            target: './app/children/pages/articles/broadcast/broadcast.html',
            data: { name: 'JavaScript Broadcast Channels', doc: './app/children/pages/articles/docs/how/broadcast.md' },
            children: []
        },
        { path: '**', name: '404:root', target: './app/children/pages/404/404.html' },
    ]
};
