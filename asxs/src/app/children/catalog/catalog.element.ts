
import type { ToDo } from '@asxs/core/types';
import { customElement, ElementCrawler, Loop } from '@asxs/core';
import { Route } from '@asxs/core/router';
import { menuitems as menu, documentation } from './core/content';
import { default as magazine } from './core/templates/magazine.template.html?raw';
import { default as submenu } from './core/templates/submenu.template.html?raw';
import { default as template } from './catalog.element.html?raw';
import { default as styles } from './catalog.element.css?raw';
import './children/documentation/documentation.element';

const { log, warn, error: err } = console;
const LANDING_TAB = 'as:query:variables';
const menuitems = menu.slice(0, 5);
const menumore = menu.slice(5);
const titles = {
    'dialogs': 'Queued Modal',
    'toasts': 'Toasts',
    'quickviews': 'Quickviews',
    'antitamper': 'Antitamper',
};

export const TAGNAME = 'at-catalog';
export @customElement(TAGNAME) class CatalogElement extends Route {
    ['as:crawler']: ElementCrawler = new ElementCrawler(this);
    [LANDING_TAB]: HTMLInputElement = document.createElement('input');
    get ['as:state']() {
        const { id } = this;
        
        return {
            id,
            menu: new Loop(menuitems).with('<li class="menu item"><a class="item control" href="./asxs/docs/#${id}">${title}</a></li>'),
            more: new Loop(menumore).with(submenu).use(titles, 'titles'),
            documentation: new Loop(documentation).with(magazine),
        };
    }
    
    ['change:menu:item'](e: MouseEvent) {
        const { target } = e;
        const { id } = target as HTMLElement;
        const element = this.querySelector(`.content.section .section.control[id="${id}"] + .section.document`) as HTMLElement;
        
        element.scrollIntoView({ behavior: 'smooth' });
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
    
    connectedCallback( x = super.connectedCallback()): void {
        this.#initialize();
        this.addEventListener('change', this as ToDo, true);
    }
    
    disconnectedCallback( x = super.disconnectedCallback() ): void {
        this.removeEventListener('change', this as ToDo, true);
    }
    
    render(): string {
        return `
            ${ super.render() }
            <style>${styles}</style>
            ${template}
        `;
    }
    
};
