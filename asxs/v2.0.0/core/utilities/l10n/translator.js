
import { root } from '/asxs/v2.0.0/core/element/window.js';

const { location } = root;
const LANGUAGE_EN_US = 'en-US';
const LANGUAGE_ES_MX = 'es-MX';
const DIALECT_EN = 'en';
const DIALECT_ES = 'es';
const DEFAULT_DIALECTS = {
    [LANGUAGE_EN_US]: DIALECT_EN,
    [LANGUAGE_ES_MX]: DIALECT_ES,
};

class Translator {
    language = LANGUAGE_EN_US;
    dialects = DEFAULT_DIALECTS;
    locales = { };
    translators = new Set();
    dialect = DEFAULT_DIALECTS[this.language];
    locale = this.locales[this.dialect];
    
    constructor(options = {}) {
        const { dialects, locales, translators } = { ...this, ...options };
        const { navigator } = window;
        const { searchParams } = new URL(location);
        const { language: l, lang = searchParams.get('lang') || l } = navigator;
        
        this.dialects = dialects;
        this.locales = locales;
        this.translators = translators;
        this.change(lang);
        
        return this;
    }
    
    change = (language = LANGUAGE_EN_US) => {
        const { dialects, locales } = this;
        const { [language]: dialect } = { ...DEFAULT_DIALECTS, ...dialects };
        const { [dialect]: locale } = locales;
        
        this.language = language;
        this.dialect = dialect;
        this.locale = locale;
        
        return dialect;
    };
    
    translate = (key) => {
        const { locale, translators } = this;
        const { [key]: value } = locale;
        return [ ...translators ].reduce( (p, fn) => fn.call({ key, locale }, p), value );
    };
    
}

export { Translator };
