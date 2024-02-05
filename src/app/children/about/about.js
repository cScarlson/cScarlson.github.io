
import { f, console } from '/browserless/core.js';
import { metadata as meta } from '/browserless/kit/decorators/metadata.js';
import { Sandbox, translate } from '/src/app/core.js';

const { log } = console;
const metadata = {
    ...meta,
    template: './src/app/children/about/about.html',
};

f('my-about', metadata, Sandbox, new class {
    call = async ($) => ({
        metadata: $.interpolate({
            title: await translate('ABOUT:TITLE'),
            content: await translate('ABOUT:CONTENT'),
        })
    })
});
