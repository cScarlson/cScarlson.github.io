
const dialects = {
    'en-US': 'en',
};

class Translator {
    language = 'en-US';
    dialect = dialects[this.language];
    locales = { };
    locale = this.locales[this.dialect];
    
    constructor(options = {}) {
        const { locales } = { ...this, ...options };
        const { navigator } = window;
        const { language } = navigator;
        const dialect = dialects[language];
        const locale = locales[dialect];
        
        this.language = language;
        this.dialect = dialect;
        this.locale = locale;
        
        return this;
    }
    
    translate = (key) => {
        const { locale } = this;
        const translation = locale[key];
        return translation;
    };
    
}

export { Translator };
