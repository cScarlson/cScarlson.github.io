
import { Console } from './console';
export const console = new (class Production extends Console {
    
    log(env, ...splat) {
        if (env !== '[dev]') return;
        super.log(...splat);
    }
    
    info(env, ...splat) {
        if (env !== '[dev]') return;
        super.info(...splat);
    }
    
    warn(env, ...splat) {
        if (env !== '[dev]') return;
        super.warn(...splat);
    }
    
    error(env, ...splat) {
        if (env !== '[dev]') return;
        super.error(...splat);
    }
    
    dir(env, ...splat) {
        if (env !== '[dev]') return;
        super.dir(...splat);
    }
    
})();
