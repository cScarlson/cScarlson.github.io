
import { environment } from '/env/env.js';

const { origin: hostmaster } = environment;
        
export class Article {
    id = 'Article[MISSING ID]';
    publisher = 'Article[MISSING PUBLISHER]';
    origin = 'Article[MISSING ORIGIN]';
    host = 'Article[MISSING HOST]';
    date = new Date().toISOString();  // derive dates using `new Date(YYYY, M, D, H, m).toISOString();`
    title = 'Article[MISSING TITLE]';
    subtitle = 'Article[MISSING SUBTITLE]';
    rmd = 'Article[MISSING RMD SOURCE]';
    url = new URL('https://missing.rmd');
    thumbnail = 'Article[MISSING RMD SOURCE]';
    authors = [];
    tags = [];
    
    constructor(options = {}) {
        const { publisher, host: HOST, date, title, subtitle, rmd, thumbnail, authors, tags } = { ...this, ...options };
        const { origin, host, pathname } = new URL(rmd, hostmaster);
        const [ hostname, port ] = host.split(':');
        const [ empty, magazinejs, ...segments ] = pathname.split('/');
        const filename = segments.pop();
        const slug = filename.split('.').join('');
        const id = [ hostname, port, ...segments, slug ].join('');  // use RMD URL to prevent duplicate entries of the same article
        const url = new URL(rmd, hostmaster);
        
        this.id = id;
        this.publisher = publisher;
        this.origin = origin;
        this.host = HOST;
        this.date = date;
        this.title = title;
        this.subtitle = subtitle;
        this.rmd = rmd;
        this.url = url;
        this.thumbnail = thumbnail;
        this.authors = authors;
        this.tags = tags;
        
        return this;
    }
    
};
