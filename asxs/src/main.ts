
import './lib/styles/reset.css';
import './lib/styles/variables.css';
import './lib/styles/spacing.css';
import './lib/styles/theme.css';
import './app/app.element.ts';

const { log } = console;
const app = document.querySelector('as-app');

setTimeout(x => app!.setAttribute('test', 'aaaaaaaaaaaaa'), 1_000 * 3);
log(`>...`, app);
