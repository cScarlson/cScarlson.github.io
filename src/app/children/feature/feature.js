
import { f, console } from '/browserless/core.js';
import { metadata as meta } from '/browserless/kit/decorators/metadata.js';
import { Sandbox } from '/src/app/core.js';

const { log } = console;
const metadata = {
    ...meta,
    template: './src/app/children/feature/feature.html',
    styles: './src/app/children/feature/feature.css'
};

f('my-feature', metadata, Sandbox, { call: ($) => ({ metadata: $ }) });
