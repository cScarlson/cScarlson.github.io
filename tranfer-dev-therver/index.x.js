
import { WebSocketServer } from 'ws';
import { Arguments } from 'utilities/argv.js';
import fs from 'fs';
import express from 'express';
import utilities from 'utilities/utilities.js';
import tranfer from 'tranfer/tranfer.js';

const { argv } = process;
const $args = new Arguments(argv);
const { data: args } = $args;
const { mode } = args;  // THIS SHOULD JUST BE MODE. LEAVE `type` TO BE CONFIGURABLE (OR NOT) BY `config.configure()`.
const OBSERVATION_DEBOUNCE_RATE = (1000 * 0.25);
let websocket = null;

/*
init()  #options/env
    build()  #options/env
        then: start-server()
        then: open-socket()  #server
            @handleConnection  #websocket
                @handleMessage
        then: watch-filesystem()
            @observeFilesystem  #observers #websocket
    onsave: build()  #options/env
        then: send-signal()  #websocket
*/
const completed = tranfer({ mode })
    .then(serve)
    .then(connect)
    .then(observe)
    ;

function log(req, res, next) {
    const { method, protocol, hostname, path, socket } = req;
    const { localPort: port } = socket;
    
    console.log(`[${method}] ${protocol}://${hostname}:${port}${path}`);
    next();
}

function serve() {
    const app = express();
    const location = './dist', directory = express.static(location);
    const server = app
        .use('/', log, directory)
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

function handleSocketConnection(socket) {
    console.log(`websocket connected...`);
    websocket = socket;  // note: this is dynamic. every refresh reconnects to reinvoke this handler.
}
    
const handleFilesystemChanges = utilities.debounce( (type, filename) => {
    console.log(`handling:filesystem:changes...`);
    completed
        .then( observers => tranfer({ mode }) )
        .then( ready => websocket.send('something') )
        ;
}, OBSERVATION_DEBOUNCE_RATE );
