
const { console: native } = window;

class Console {
    
    log(...splat: any[]): void {
        native.log(...splat);
    }
    
    info(...splat: any[]): void {
        native.info(...splat);
    }
    
    warn(...splat: any[]): void {
        native.warn(...splat);
    }
    
    error(...splat: any[]): void {
        native.error(...splat);
    }
    
    dir(...splat: any[]): void {
        native.dir(...splat);
    }
    
}

export { native as console, Console };
