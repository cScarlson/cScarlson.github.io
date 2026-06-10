
import { Translator as Core } from '/asxs/v2.0.0/core/utilities/l10n/translator.js';

const { innerText: locale_en } = document.querySelector('script[type="application/json"]#en');
const { innerText: locale_es } = document.querySelector('script[type="application/json"]#es');
const en = JSON.parse(locale_en);
const es = JSON.parse(locale_es);
const locales = { en, es };
const options = { locales };

export const { translate, change } = new (class CopyrightTranslator extends Core {})(options);
