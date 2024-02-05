
import { f, console } from '/browserless/core.js';
import { metadata as meta } from '/browserless/kit/decorators/metadata.js';
import { Sandbox, translate } from '/src/app/core.js';

const { log } = console;
const metadata = {
    ...meta,
    template: './src/app/children/contact/contact.html',
};

f('my-contact', metadata, Sandbox, new class {
    call = async ($) => ({
        metadata: $.interpolate({
            title: await translate('CONTACT:TITLE'),
            content: await translate('CONTACT:CONTENT'),
        })
    })
});
