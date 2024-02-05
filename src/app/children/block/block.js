
import { f, console } from '/browserless/core.js';
import { metadata as meta } from '/browserless/kit/decorators/metadata.js';
import { Sandbox } from '/src/app/core.js';

const { log } = console;
const template = '<slot name="default"></slot>';
const metadata = {
    ...meta,
    styles: './src/app/children/block/block.css'
};

f('my-block', metadata, Sandbox, {
    call: ({ styles }) => ({ metadata: { template, styles } })
});
