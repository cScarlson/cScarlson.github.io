
const Page = function Page(options = {}) {
    const { name, uri } = options;
    
    function update({ content: pages } = {}) {
        if (!pages) return;
        const page = pages.find( page => page.name === name );
        this.page = page;
    }
    
    // export precepts
    this.call = update;
    this.attach(this);
    this.use(uri);
    
    return this;
};

export { Page };
