
const dialects = {
    'en-US': 'en',
};

class Translator {
    language = 'en-US';
    dialect = dialects[this.language];
    locales = { };
    locale = this.locales[this.dialect];
    translators = new Set();
    
    constructor(options = {}) {
        const { locales, translators } = { ...this, ...options };
        const { navigator } = window;
        const { language } = navigator;
        const dialect = dialects[language];
        const locale = locales[dialect];
        
        this.language = language;
        this.dialect = dialect;
        this.locale = locale;
        this.translators = translators;
        
        return this;
    }
    
    translate = async (key) => {
        const { locale, translators } = this;
        const { [key]: value } = locale;
        const promise = Promise.resolve(value);
        const translation = await [ ...translators ].reduce( async (p, fn) => await fn.call({ key, locale }, await p), promise );
        
        return translation;
    };
    
}

export { Translator };
