
export class Publisher {
    name = 'Error: Publisher[name]';
    authors = [];
    articles = [];
    
    constructor(options = {}) {
        const { publisher: name, articles } = { ...this, ...options };
        const authors = [ ...articles.reduce( reduce, new Set() ) ];
        
        function reduce($, { authors }) {
            return authors.reduce( ($, author) => $.add(author), $ );
        }
        
        this.name = name;
        this.authors = authors;
        this.articles = articles;
        
        return this;
    }
    
};
