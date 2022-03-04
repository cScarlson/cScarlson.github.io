
import {  } from 'rxjs';
import {  } from 'rxjs/operators/index.js';
import { WebSocketServer } from 'ws';
import { Arguments } from 'utilities/argv.js';
import path from 'path';
import url from 'url';
import fs from 'fs';
import * as fsp from 'fs/promises';
import express from 'express';
import utilities from 'utilities/utilities.js';
import tranfer from 'tranfer/tranfer.js';
import bunder from 'tranfer/webpack.config.js';
import config from '../tranfer.config.js';

const { dirname } = path;
const { fileURLToPath } = url;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { log } = console;
const { argv } = process;
const { data: args } = new Arguments(argv);
const { mode } = args;
const { preprocess, preprocessors, prewrite, postwrite, postprocessors, postprocess } = config;
const OBSERVATION_DEBOUNCE_RATE = (1000 * 0.25);
const script = `<script>( new WebSocket('ws://localhost:3000') ).addEventListener('message', e => location.reload(true), false)</script>`;
let websocket = null;
const OPTIONS = {
    mode,
};
const build = options => tranfer(options).then(pushSocket);
const completed = build(OPTIONS)
    .then(serve)
    .then(connect)
    .then(observe)
    ;

function pushSocket() {
    const location = path.resolve(process.cwd(), './dist/index.html');
    const indexHTML = fsp.readFile(location, 'utf8');
    const promise = indexHTML
        .then( contents => contents.replace('</body>', `</body>${script}`) )
        .then( contents => fsp.writeFile(location, contents) )
        .then( x => log(`pushed websocket to index.html...`) )
        ;
    return promise;
}

function examine(req, res, next) {
    const { method, protocol, hostname, path, socket } = req;
    const { localPort: port } = socket;
    
    console.log(`[${method}] ${protocol}://${hostname}:${port}${path}`);
    next();
}

function serve() {
    const app = express();
    const location = './dist', directory = express.static(location);
    const server = app
        .use('/', examine, directory)
        .get( '*', (req, res) => res.redirect('/') )
        .listen(3000)
        ;
    console.log(`serving...(${location})`);
    
    return server;
}

function connect(server) {
    const connection = new WebSocketServer({ server });
    
    console.log(`opening websocket...`);
    connection.on('connection', handleSocketConnection);
    
    return connection;
}

function observe() {
    const observers = new Set()
        .add( fs.watch('./src', handleFilesystemChanges) )
        .add( fs.watch('./index.html', handleFilesystemChanges) )
        ;
    console.log(`observing...(${observers.size})`);
    
    return observers;
}

const handleSocketConnection = utilities.debounce( (socket) => {
    console.log(`websocket connected...`);
    websocket = socket;  // note: this is dynamic. every refresh reconnects to reinvoke this handler.
}, OBSERVATION_DEBOUNCE_RATE );
    
const handleFilesystemChanges = utilities.debounce( (type, filename) => {
    console.log(`handling:filesystem:changes...`);
    completed
        .then( observers => build(OPTIONS) )
        .then( ready => websocket.send('something') )
        ;
}, OBSERVATION_DEBOUNCE_RATE );
