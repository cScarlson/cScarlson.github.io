
import { f, console } from '/browserless/core.js';
import { metadata as meta } from '/browserless/kit/decorators/metadata.js';
import { Sandbox, translate } from '/src/app/core.js';

const { log } = console;
const metadata = {
    ...meta,
    template: './src/app/children/landing/landing.html',
    styles: './src/app/children/landing/landing.css'
};

f('my-landing', metadata, Sandbox, {
    call: async ($) => ({
        metadata: $.interpolate({
            title: await translate('LANDING:TITLE'),
            subtitle: await translate('LANDING:SUBTITLE'),
            content: await translate('LANDING:CONTENT'),
        })
    }),
});
