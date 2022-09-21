
import V, {} from '/vertices/core.js';
import { Page } from '/app/subsystem/page.js';

const { log } = console;
const items = [
    { title: "Home", description: "", uri: '/home' },
    { title: "Resume", description: "", uri: '/resume' },
    { title: "CV", description: "Curriculum Vitae", uri: '/cv' },
    { title: "About", description: "", uri: '/about' },
    { title: "Vertices", description: "The framework used for this site", uri: '/vertices' },
    { title: "Thoughts", description: "A collection of headspaces", uri: '/blog' },
    { title: "...more", description: "", uri: '/footer' },
];

V('menu:links', 'sandbox', function HomeComponent($) {
    this.items = items;
    this.use(`./app/header/subsystem/menu/links/links.component.html`);
    return this;
});
