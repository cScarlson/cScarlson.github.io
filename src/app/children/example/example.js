
import { f, console, Sandbox } from '/browserless/core.js';
import { metadata as meta } from '/browserless/kit/decorators/metadata.js';

const { log } = console;
const metadata = {
    ...meta,
    template: './src/app/children/example/example.html',
    styles: './src/app/children/example/example.css',
};

f('my-example', metadata, Sandbox, {
    call: ($) => ({ metadata: $ })
});
