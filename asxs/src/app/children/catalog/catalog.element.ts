
import type { ToDo } from '@asxs/core/types';
import { customElement, CustomElement, ElementCrawler, Loop } from '@asxs/core';
import { type State } from '@asxs/core/router';
import { menuitems as menu, documentation } from './core/content';
import { default as magazine } from './core/templates/magazine.template.html?raw';
import { default as submenu } from './core/templates/submenu.template.html?raw';
import { default as template } from './catalog.element.html?raw';
import { default as styles } from './catalog.element.css?raw';
import './children/documentation/documentation.element';

const { log, warn, error: err } = console;
const LANDING_TAB = 'as:query:antitamper';
const menuitems = menu.slice(0, 4);
const menumore = menu.slice(4);
const titles = {
    'dialogs': 'Queued Modal',
    'toasts': 'Toasts',
    'quickviews': 'Quickviews',
    'antitamper': 'Antitamper',
};

export const TAGNAME = 'at-catalog';
export @customElement(TAGNAME) class CatalogElement extends CustomElement {
    ['as:crawler']: ElementCrawler = new ElementCrawler(this);
    [LANDING_TAB]: HTMLInputElement = document.createElement('input');
    get ['as:state']() {
        const { state } = this;
        const { route } = state;
        const { id } = route;
        
        return {
            id,
            menu: new Loop(menuitems).with('<li class="menu item"><label class="item control" for="${this}" tabindex="0">${this}</label></li>'),
            more: new Loop(menumore).with(submenu).use(titles, 'titles'),
            documentation: new Loop(documentation).with(magazine),
        };
    }
    
    constructor(private state: State) {
        super();
    }
    
    ['change:menu:item'](e: MouseEvent) {
        const { target } = e;
        const { id } = target as HTMLElement;
        const element = this.querySelector(`.content.section.control[id="${id}"]`) as HTMLElement;
        
        log(`@MENU-ITEM-CHANGE`, id, element);
        // element.scrollIntoView({ behavior: 'smooth' });
    }
    
    ['as:update:handler'](content: string) {
        const { [LANDING_TAB]: control } = this;
        control.checked = true;
    }
    
    #initialize() {
        for (const doc of documentation) this.#init(doc);
    }
    
    #init(doc: ToDo) {
        if (!doc?.module?.init) return;
        const { module } = doc;
        module.init(this);
    }
    
    connectedCallback( x = super.connectedCallback() ): void {
        this.#initialize();
        this.addEventListener('change', this as ToDo, true);
    }
    
    disconnectedCallback( x = super.disconnectedCallback() ): void {
        this.removeEventListener('change', this as ToDo, true);
    }
    
    render(): string {
        return `
            <style>${styles}</style>
            ${template}
        `;
    }
    
};
