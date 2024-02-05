
import { Translator } from '/browserless/kit/l10n/translator.js';
import { translators } from '/src/app/core/utilities/translators/translators.js';
import { default as en } from '/src/app/locales/en.locale.js';

const locales = { en, es: en };
const { translate } = new Translator({ locales, translators });

export { translate };
