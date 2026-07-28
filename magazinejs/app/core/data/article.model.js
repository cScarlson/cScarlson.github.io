
export class Article {
    id = 'Article[MISSING ID]';
    publisher = 'Article[MISSING PUBLISHER]';
    origin = 'Article[MISSING ORIGIN]';
    date = new Date().toISOString();  // derive dates using `new Date(YYYY, M, D, H, m).toISOString();`
    title = 'Article[MISSING TITLE]';
    subtitle = 'Article[MISSING SUBTITLE]';
    rmd = 'Article[MISSING RMD SOURCE]';
    url = new URL('https://missing.rmd');
    authors = [];
    tags = [];
    
    constructor(options = {}) {
        const { publisher, origin, date, title, subtitle, rmd, authors, tags } = { ...this, ...options };
        const { host, pathname } = new URL(rmd);
        const [ hostname, port ] = host.split(':');
        const [ empty, magazinejs, ...segments ] = pathname.split('/');
        const filename = segments.pop();
        const slug = filename.split('.').join('');
        const id = [ hostname, port, ...segments, slug ].join('');  // use RMD URL to prevent duplicate entries of the same article
        const url = new URL(rmd);
        
        this.id = id;
        this.publisher = publisher;
        this.origin = origin;
        this.date = date;
        this.title = title;
        this.subtitle = subtitle;
        this.rmd = rmd;
        this.url = url;
        this.authors = authors;
        this.tags = tags;
        
        return this;
    }
    
};
