
import { Translator } from '/app/core/l10n/translator.js';
import { default as en } from '/app/locales/en.locale.js';

const locales = { en, es: en };
const { translate } = new Translator({ locales });

export { translate };
