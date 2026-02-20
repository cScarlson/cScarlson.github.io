
import './reset.css';
import './app/app.element.ts';
// import './app/children/hero/hero.red.html?raw';

const { log } = console;
const app = document.querySelector('as-app');

setTimeout(x => app!.setAttribute('test', 'aaaaaaaaaaaaa'), 1_000 * 3);
log(`>...`, app);
