
import V, { bootstrap } from './vertices/core.js';

const { log } = console;
const { docket } = V;

docket
    .set('app', './app/app.vertex.html')
    .set('menu', './app/subsystem/menu.vertex.html')
    .set('page', './app/subsystem/page.vertex.html')
    .set('page:home', './app/subsystem/pages/home.vertex.html')
    ;
bootstrap(V)
    .catch(katch)
    ;

function katch(error) {
    console.error(`Vertices: Uncaught Module-Load Error`, error);
    return error;
}
