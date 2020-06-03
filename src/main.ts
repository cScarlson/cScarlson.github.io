
import config from '../app.json';  // janky trigger for refresh when config is updated (SCSS doesn't work)
import { app } from './app/app';
console.log(`app:`, app, config);
