
import { WebSocketServer } from 'ws';
import express from 'express';
import fs from 'fs';
import utilities from 'utilities/utilities.js';

const { log } = console;
const OBSERVATION_DEBOUNCE_RATE = (1000 * 0.25);
const location = './dist', directory = express.static(location);
const app = express();
const server = app
    .use('/', examine, directory)
    .get( '*', (req, res) => res.redirect('/') )
    .listen(3000)
    ;
const connection = new WebSocketServer({ server });
const observers = observe();
const debounced = utilities.debounce(handleSocketConnection, OBSERVATION_DEBOUNCE_RATE);
let websocket = null;

function observe() {
    const options = { recursive: true };
    const debounced = utilities.debounce(handleFilesystemChanges, OBSERVATION_DEBOUNCE_RATE);
    const observers = new Set()
        .add( fs.watch('./dist', options, debounced) )
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
    log(`websocket connected...`);
    websocket = socket;
}
    
function handleFilesystemChanges(type, filename) {
    console.log(`handling:filesystem:changes...`);
    websocket.send('something');
}

connection.on('connection', debounced);
