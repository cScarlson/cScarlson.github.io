
import { $, utilities } from '/developers/app/core.js';
import { collection } from './characters.js';

const { log } = console;
const PAGER_URI = `/developers/app/children/pages/ascii/children/pager/pager.html`;
const TILE_CLASSES = [ 'alkali metals', 'metaloids', 'actinides', 'alkaline earth metals', 'reactive nonmetals', 'unknown properties', 'transition metals', 'noble gases', 'post transition metals', 'lanthanides' ];
const headers = { 'Content-Type': 'application/json' };
const pager = {
    limit: 50,
    index: 0,
    get start() { return (this.index * this.limit) },
    get end() { return (this.index + 1) * this.limit },
    
    page(direction) {
        if (direction === '<' && this.index === 0) return log(`CANNOT PAGE LOWER THAN ZERO`);
        const { index, limit, start, end } = this;
        const next = index + { '<': -1, '>': 1 }[ direction ];
        
        this.index = next;
        return this;
    },
    
    set(n) {
        this.index = n;
        return this;
    },
    
    slice(collection = []) {
        const { start, end } = this;
        const subset = collection.slice(start, end);
        return subset;
    },
    
    total(collection) {
        const { limit } = this;
        const { length } = collection;
        const total = Math.ceil(length / limit);
        
        return total;
    }
};

$.set('ascii-view', 'load', 'click', 'change', 'close', 'error', class Test {
    static selector = 'h2[x="true"]';
    modal = null;
    details = null;
    template = '';
    query = '';
    pager = pager;
    $collection = collection.reduce( ($, data) => $.set(data.code, data), new Map() );
    collection = collection;
    selection = { };
    tile = null;
    navigation = null;
    get items() { return this.filter(this.query, this.collection) }
    
    constructor($) {
        const { innerHTML: template } = document.querySelector('template#asciiTile');
        const dialog = document.querySelector('dialog.ascii.tile.view');
        const details = dialog.querySelector('.view.content');
        
        this.$ = $;
        this.template = template;
        this.modal = dialog;
        this.details = details;
        $.on('hook:ready', this.handlePagerReady);
        $.on('pager:advancement', this.handlePagerAdvancement);
        $.subscribe('ASCII:SEARCH:QUERY', this.handleQuery);
    }
    
    async initialize() {
        const { pager, query, collection } = this;
        const filtered = this.filter(query, collection);
        const sliced = pager.slice(filtered);
        
        this.configurePager();
        this.render(sliced);
    }
    
    configurePager() {
        const { $, pager, navigation, items } = this;
        const { limit, index, start, end } = pager;
        const total = pager.total(items);
        const config = { limit, index, start, end, total };
        
        $.fire.call({ target: navigation }, 'pager:config', config);
        
        return this;
    }
    
    render(collection) {
        const { template } = this;
        const container = document.querySelector('.ascii.view .view.list');
        const html = this.hydrate(template, collection);
        
        container.innerHTML = html;
        
        return this;
    }
    
    hydrate(template, collection) {
        const html = collection.slice(0, 50).map( item => utilities.interpolate(template)(item) ).join(' ');
        return html;
    }
    
    filter(query, collection = []) {
        const lower = query.toLowerCase();
        const filtered = (query?.length > 2) ? collection.filter(filter) : collection;
        
        function filter(data) {
            const { character: $character, code: $code, unicode: $unicode, tags: $tags } = data;
            const character = $character.toLowerCase();
            const code = $code.toLowerCase();
            const unicode = $unicode.toLowerCase();
            const tags = $tags.map( tag => tag.toLowerCase() );
            var valid = false
              , valid = valid || character.includes(lower)
              , valid = valid || code.includes(lower)
              , valid = valid || unicode.includes(lower)
              , valid = valid || tags.reduce( (b, tag) => b || tag.includes(lower), false )
              ;
            return valid;
        }
        
        return filtered;
    }
    
    select(tile, data) {
        const { modal, details } = this;
        const { open } = modal;
        const { parentElement: listitem } = tile;
        const clone = listitem.cloneNode(true);
        
        tile.checked = true;
        this.tile = tile;
        this.selection = data;
        clone.querySelector('input').remove();
        details.appendChild(clone);
        if (!open) modal.show();
        
        return this;
    }
    
    deselect(data) {
        if (!this.tile) return this;
        if (!this.selection?.code) return this;
        const { tile, modal, details } = this;
        const { open } = modal;
        
        details.innerHTML = '';
        tile.checked = false;
        this.tile = null;
        this.selection = {};
        if (open) modal.close();
        
        return this;
    }
    
    handleEvent(e) {
        const { $ } = this;
        const { type, target } = e;
        const { classList } = target;
        const action = `${type}:${classList}`;
        const handle = {
            'change:tile facade': this.handleTileSelection,
            'click:tile facade': this.handleTileDeselection,
            'close:ascii tile view': this.handleModalClose,
        }[ action ];
        
        if (handle) handle.call(this, e);
        else log(`@ASCII/view.handleEvent`, e.type, e.target);
        
        return e;
    }
    
    handleTileSelection(e) {
        const { $collection } = this;
        const { target } = e;
        const { value: code } = target;
        const data = $collection.get(code);
        
        this.select(target, data);
        e.stopImmediatePropagation();
    }
    
    handleTileDeselection(e) {
        if (!this.selection.code) return;
        const { selection } = this;
        const { target } = e;
        const { value: code } = target;
        
        if (code !== selection.code) return;
        this.deselect();
    }
    
    handleModalClose(e) {
        this.deselect();
    }
    
    handlePagerReady = (e) => {
        if (e.target.tagName !== 'ASCII-PAGER') return log(e.target.tagName);
        const { target } = e;
        
        this.navigation = target;
        this.initialize();
    };
    
    handlePagerAdvancement = (e) => {
        const { $, pager, items } = this;
        const { detail: data } = e;
        const { n } = data;
        
        this.render( pager.set(n).slice(items) ).configurePager();
        log(e.type, n, pager.index);
    };
    
    handleQuery = (e) => {
        const { type, data } = e;
        const { query } = data;
        
        this.query = query;
        this.render(this.items).configurePager();
    };
    
});
