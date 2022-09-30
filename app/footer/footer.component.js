
import V, {} from '/vertices/core.js';

const site = [
    { id: 0, name: 'home', title: "Home", href: '#/home' },
    { id: 1, name: 'resume', title: "Resume", href: '#/resume' },
    { id: 2, name: 'cv', title: "Curriculum Vitae", href: '#/cv' },
    { id: 2, name: 'consulting', title: "Consulting", href: '#/consulting' },
    { id: 3, name: 'about', title: "About", href: '#/about' },
    { id: 4, name: 'vertices', title: "Vertices", href: '#/vertices' },
    { id: 5, name: 'blog', title: "Articles", href: '#/blog' },
];
const portfolio = [
    { id: 0, name: 'this', title: "This Site", href: '#/' },
    { id: 0, name: 'github', title: "GitHub", href: 'https://github.com/cScarlson', target: '_blank' },
    { id: 0, name: 'codepen', title: "CodePen", href: 'https://codepen.io/cScarlson', target: '_blank' },
    { id: 0, name: 'stackblitz', title: "StackBlitz", href: 'https://stackblitz.com/@cScarlson', target: '_blank' },
];
const social = [
    { id: 0, name: 'linkedin', title: "LinkedIn", href: 'https://www.linkedin.com/in/cody-s-carlson-1b837259', target: '_blank' },
];
const inspiration = [
    { id: 0, name: 'nicholaszakas', title: "Nicholas Zakas: Scalable Application Architecture", href: 'https://www.slideshare.net/nzakas/scalable-javascript-application-architecture', target: '_blank' },
    { id: 1, name: 'addyosmani', title: "Addy Osmani: Scalable Application Architecture", href: 'https://addyosmani.com/largescalejavascript', target: '_blank' },
];
const resources = [
    { id: 0, name: 'site', title: "This Site", children: site },
    { id: 1, name: 'portfolio', title: "Portfolio", children: portfolio },
    { id: 2, name: 'social', title: "Social Media", children: social },
    { id: 4, name: 'inspiration', title: "Inspiration", children: inspiration },
    { id: 5, name: 'booklist', title: "Booklist", children: [] },
];

V('footer', 'sandbox', function HeaderComponent($) {
    this.resources = resources;
    $.use('./app/footer/footer.component.html');
    return this;
});
