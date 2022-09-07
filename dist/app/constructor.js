
import V, {} from '/vertices/core.js';
import { Store } from '/vertices/store/store.js';
import { Sandbox } from './core/sandbox.js';
import { Application } from './core/application.js';
import { Reducer } from './core/store/reducer.js';
import { middleware } from './core/store/middleware.js';
//
import '/vertices/vertices.js';
import './app.component.js';
import './child.now.js';
import './child.later.js';
import './header/header.component.js';
import './header/menu/menu.component.js';
import './subsystem/home/home.component.js';
import './subsystem/about/about.component.js';
import './subsystem/resume/resume.component.js';
import './subsystem/cv/cv.component.js';
import './subsystem/vertices/vertices.component.js';

const state = { };
const reducer = new Reducer(middleware);
const store = new Store({ state, reducer });
const app = new Application({ store });

V('sandbox', app, Sandbox);
V.bootstrap(document.body.parentElement);
