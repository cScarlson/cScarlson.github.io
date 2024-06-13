
import { f, console } from '/browserless/core.js';
import { metadata as meta } from '/browserless/kit/decorators/metadata.js';
import { Sandbox, translate } from './core.js';

const { log } = console;
const metadata = {
    ...meta,
    template: './src/app/app.html',
    styles: './src/app/app.css',
};

f('my-app', metadata, Sandbox, function App($) {
    const { element, template, styles } = $;
    
    return {
        metadata: { template, styles },
        connectedCallback() {
            setTimeout(x => this.initialize(location), 1500);
        },
        initialize({ hash: h }) {
            const { [h]: hash } = { [h]: h, ['']: '/' };
            location.hash = '';
            location.hash = hash;
        }
    };
});
