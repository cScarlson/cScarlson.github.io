
import { f, console } from './browserless/core.js';
import './browserless/kit/submiton.directive.js';
import './src/app/app.js';
import './src/app/children/block/block.js';
import './src/app/children/feature/feature.js';
import './src/app/children/about/about.js';
import './src/app/children/contact/contact.js';
import './src/app/children/contact/children/form/form.js';
import './src/app/children/pricing/pricing.js';
import './src/app/children/landing/landing.js';
import './src/app/children/banner/banner.js';
import './src/app/children/menu/menu.js';
import './src/app/children/footer/footer.js';

const { log } = console;

f.bootstrap();

