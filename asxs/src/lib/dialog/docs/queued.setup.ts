
import type { ToDo } from '@asxs/core/types';
import { execute } from './queued.js';

export const { init } = new (class {
    
    init = (sandbox: ToDo) => {
        execute.call(sandbox);
    };
    
})();
