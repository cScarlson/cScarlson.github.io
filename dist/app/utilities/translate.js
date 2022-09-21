
import { Translator } from '/dist/app/core/l10n/Translator.js';
import { default as en } from '/dist/app/locales/en.locale.js';

const locales = { en, es: en };
const { translate } = new Translator({ locales });

export { translate };
