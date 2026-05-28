
import { Console } from './console';
export const console: Console = new (class Production extends Console {
    
    log(env: string, ...splat: any[]): void {
        if (env !== '[prd]') return;
        super.log(...splat);
    }
    
    info(env: string, ...splat: any[]): void {
        if (env !== '[prd]') return;
        super.info(...splat);
    }
    
    warn(env: string, ...splat: any[]): void {
        if (env !== '[prd]') return;
        super.warn(...splat);
    }
    
    error(env: string, ...splat: any[]): void {
        if (env !== '[prd]') return;
        super.error(...splat);
    }
    
    dir(env: string, ...splat: any[]): void {
        if (env !== '[prd]') return;
        super.dir(...splat);
    }
    
})();
