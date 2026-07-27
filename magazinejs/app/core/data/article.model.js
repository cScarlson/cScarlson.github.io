
export class Article {
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
        const url = new URL(rmd);
        
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
