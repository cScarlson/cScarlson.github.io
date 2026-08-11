
import { Translator } from './translator.js';
import { translators } from './translators/translators.js';
import { default as en } from '/websites/core/utilities/l10n/locales/en.locale.js';

const locales = { en, es: en };
const { translate } = new Translator({ locales, translators });

export { translate };
