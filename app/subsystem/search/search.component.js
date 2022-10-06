
import V, {} from '/vertices/core.js';
import { translate } from '/app/utilities/translate.js';

const { log } = console;
const options = [
    { id: 0,  title: `page: Welcome`, uri: '/home' },
    { id: 1,  title: `page: Resume`, uri: '/resume' },
    { id: 2,  title: `page: Curriculum Vitae`, uri: '/cv' },
    { id: 3,  title: `page: Consulting`, uri: '/consulting' },
    { id: 4,  title: `page: About`, uri: '/about' },
    { id: 5,  title: `page: VerticesJS`, uri: '/vertices' },
    { id: 6,  title: `page: Blog Articles`, uri: '/blog' },
    { id: 7,  title: `site: LinkedIn`, uri: translate('CONTENT:CONTACT:SOCIAL:LINKEDIN'), target: '_blank' },
    { id: 8,  title: `site: GitHub`, uri: translate('CONTENT:CONTACT:SOCIAL:GITHUB'), target: '_blank' },
    { id: 9,  title: `site: CodePen`, uri: translate('CONTENT:CONTACT:SOCIAL:CODEPEN'), target: '_blank' },
    { id: 10, title: `site: Stackblitz`, uri: translate('CONTENT:CONTACT:SOCIAL:STACKBLITZ'), target: '_blank' },
    // { id: 8, title: `article: "X"`, uri: '/blog/{id}' },
];
const $options = options.reduce( ($, o) => $.set(o.title, o), new Map() );

V('search', 'sandbox', function SearchComponent($) {
    const thus = this;
    
    function handleEvent(e) {
        const { type } = e;
        const handle = {
            'submit': handleSubmit,
            'focus': handleFocus,
            'blur': handleFocus,
        }[ type ];
        
        if (handle) handle.call(this, e);
    }
    
    function handleSubmit(e) {
        const { type, target } = e;
        const form = new FormData(target);
        const input = form.get('search');
        const option = $options.get(input);
        
        e.preventDefault();
        if (!option) return window.location.hash = '/';
        if (option.target) window.open(option.uri);
        else window.location.hash = option.uri;
    }
    
    function handleFocus(e) {
        if (document.activeElement === e.target) e.target.parentElement.classList.add('active');
        else e.target.parentElement.classList.remove('active');
    }
    
    function handleSearchInvoked(e) {
        const searchbox = thus.querySelector('.search.box');
        if (searchbox) searchbox.focus();
    }
    
    this.options = options;
    this.handleEvent = handleEvent;
    this.on('submit', this);
    this.on('focus', this, true);
    this.on('blur', this, true);
    this.subscribe('USER:SEARCH:INVOKED', handleSearchInvoked);
    this.use(`./app/subsystem/search/search.component.html`);
    
    return this;
});
