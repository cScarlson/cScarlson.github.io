
import { $, config } from './app/core.js';

const { log } = console;

config.set('@root', '/developers/');

$.sandbox.subscribe('WORKER:EVENT:LOG', function logEvents(e) {
    log(e);
    const { type, data } = e;
    const { channel, payload, handled } = data;
    log(`@"${type}"`, channel, `handled: ${handled}`, );
});
