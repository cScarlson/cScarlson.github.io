
const { console: native } = window;

class Console {
    
    log(...splat) {
        native.log(...splat);
    }
    
    info(...splat) {
        native.info(...splat);
    }
    
    warn(...splat) {
        native.warn(...splat);
    }
    
    error(...splat) {
        native.error(...splat);
    }
    
    dir(...splat) {
        native.dir(...splat);
    }
    
}

export { native as console, Console };
