
import { Console } from './console';
export const console = new (class Production extends Console {
    
    log(env, ...splat) {
        if (env !== '[prd]') return;
        super.log(...splat);
    }
    
    info(env, ...splat) {
        if (env !== '[prd]') return;
        super.info(...splat);
    }
    
    warn(env, ...splat) {
        if (env !== '[prd]') return;
        super.warn(...splat);
    }
    
    error(env, ...splat) {
        if (env !== '[prd]') return;
        super.error(...splat);
    }
    
    dir(env, ...splat) {
        if (env !== '[prd]') return;
        super.dir(...splat);
    }
    
})();
