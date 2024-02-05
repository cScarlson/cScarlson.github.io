
import { f, console } from '/browserless/core.js';

const { log } = console;

f.attr('[routelet]', function Routelet(attr) {  // temp/test/placeholder
    log(`@RAN ROUTELET`, attr);
});
