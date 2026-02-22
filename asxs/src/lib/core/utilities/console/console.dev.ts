
import { Console } from './console';
export const console: Console = new (class Production extends Console {
    
    log(env: string, ...splat: any[]): void {
        if (env !== '[dev]') return;
        super.log(...splat);
    }
    
    info(env: string, ...splat: any[]): void {
        if (env !== '[dev]') return;
        super.info(...splat);
    }
    
    warn(env: string, ...splat: any[]): void {
        if (env !== '[dev]') return;
        super.warn(...splat);
    }
    
    error(env: string, ...splat: any[]): void {
        if (env !== '[dev]') return;
        super.error(...splat);
    }
    
    dir(env: string, ...splat: any[]): void {
        if (env !== '[dev]') return;
        super.dir(...splat);
    }
    
})();
