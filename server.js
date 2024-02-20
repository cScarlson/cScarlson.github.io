
import { WebSocketServer } from 'ws';
import express from 'express';
import fs from 'fs';
import utilities from 'utilities/utilities.js';

class Deferred {
    promise = Promise.resolve('uninitialized');
    _resolve = () => console.log(`RESOLVE?`);
    _reject = () => console.log(`REJECT?`);
    
    constructor() {
        this.promise = new Promise(this.execute);
    }
    
    execute = (resolve, reject) => {
        this._resolve = resolve;
        this._reject = reject;
    };
    
    resolve = (data) => {
        this._resolve(data);
        return this;
    };
    
    reject = (reason) => {
        this._reject(reason);
        return this;
    };
    
}

const { log } = console;
const PORT = 3000;
const OBSERVATION_DEBOUNCE_RATE = (1000 * 0.25);
const location = './', directory = express.static(location);
const app = express();
const server = app
    .use('/', examine, directory)
    .get( '*', (req, res) => res.redirect('/') )
    .listen( PORT, () => log(`LESTENING @localhost on port ${PORT}`) )
    ;
const connection = new WebSocketServer({ server });
const observers = observe();
const debounced = utilities.debounce(handleSocketConnection, OBSERVATION_DEBOUNCE_RATE);
const deferred = new Deferred();
const websockets = new Set();

function observe() {
    const options = { recursive: true };
    const debounced = utilities.debounce(handleFilesystemChanges, OBSERVATION_DEBOUNCE_RATE);
    const observers = new Set()
        .add( fs.watch('./', options, debounced) )
        ;
    console.log(`observing...(${observers.size})`);
    
    return observers;
}

function examine(req, res, next) {
    const { method, protocol, hostname, path, socket } = req;
    const { localPort: port } = socket;
    
    console.log(`[${method}] ${protocol}://${hostname}:${port}${path}`);
    next();
}

function handleSocketConnection(socket) {
    const { resolve } = deferred;
    log(`websocket connected...`);
    websockets.add(socket);
    resolve(socket);
}
    
async function handleFilesystemChanges(type, filename) {
    log(`handling:filesystem:changes...`);
    const { promise } = deferred;
    const websocket = await promise;
    
    log(`handling:filesystem:changes...`);
    websockets.forEach( websocket => websocket.send('something') );
    log(`HANDLED:filesystem:changes...`, websockets.size);
}

connection.on('connection', debounced);
