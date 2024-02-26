
import { $ } from '/developers/app/core.js';

const { log } = console;
const core = $;

$.set('ascii:pager', 'load', 'click', 'focus', 'error', class {
    static selector = 'h2[x="true"]';
    params = {};
    root = null;
    back = null;
    forth = null;
    quicknav = null;
    numbers = null;
    
    constructor($) {
        const root = document.querySelector('.ascii.pager');
        const back = root.querySelector('.pager.control.button.back');
        const forth = root.querySelector('.pager.control.button.forth');
        const quicknav = root.querySelector('.pager.control.quicknav');
        const numbers = quicknav.querySelectorAll('.quicknav.control');
        
        this.$ = $;
        this.root = root;
        this.back = back;
        this.forth = forth;
        this.quicknav = quicknav;
        this.numbers = numbers;
        $.on('pager:config', this.handleConfig);
    }
    
    update() {
        const { config, root, back, forth, quicknav, numbers } = this;
        const { limit, index, start, end, total } = config;
        const quicknavs = Array.apply(null, { length: 5 });
        
        function set(x, i) {
            const n = (i + 1);
            const text = (index + n + 1);
            const number = quicknav.querySelector(`.quicknav.control[data-n="${n}"]`);
            
            if (text > total) number.classList.add('overflow');
            else number.classList.remove('overflow');  // assume classList.contains('overflow') is true
            number.innerHTML = text;
        }
        
        quicknavs.forEach(set);
    }
    
    handleEvent(e) {
        const { $ } = this;
        const { type, target } = e;
        const { className } = target;
        const action = `${type}:${className}`;
        const handle = {
            'click:pager control button back': this.handlePage,
            'click:pager control button forth': this.handlePage,
            'click:pager control button start': this.handleSkip,
            'click:pager control button end': this.handleSkip,
            'click:quicknav control': this.handlePage,
        }[ action ];
        
        if (handle) handle.call(this, e);
        else log(`@ASCII/pager.handleEvent`, e.type, e.target);
        
        return e;
    }
    
    handlePage(e) {
        const { $, config } = this;
        const { target } = e;
        const { className, dataset } = target;
        const { n = 1 } = dataset;
        const { limit, index, start, end, total } = config;
        const advancement = index + {
            'pager control button back':  (-1 * n),
            'pager control button forth': (+1 * n),
            'quicknav control': (+1 * n),
        }[ className ];
        
        if (advancement < 0) return;
        if (advancement >= total) return;
        $.fire('pager:advancement', { n: advancement });
    }
    
    handleSkip(e) {
        const { $, config } = this;
        const { target } = e;
        const { className } = target;
        const { limit, index, start, end, total } = config;
        const advancement = {
            'pager control button start': 0,
            'pager control button end': total - 1,
        }[ className ];
        
        $.fire('pager:advancement', { n: advancement });
    }
    
    handleConfig = (e) => {
        const { type, detail: config } = e;
        this.config = config;
        this.update();
    };
    
});
