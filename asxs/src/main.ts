
import '@asxs/styles/reset.css';
import '@asxs/styles/variables.css';
import '@asxs/styles/spacing.css';
import '@asxs/styles/theme.css';
import '@asxs/style/style.element';
import '@asxs/button/stateful/stateful.element';
import './app/app.element';

const { log } = console;
const app = document.querySelector('as-app');

setTimeout(x => app!.setAttribute('test', 'aaaaaaaaaaaaa'), 1_000 * 3);
log(`>...`, app);
