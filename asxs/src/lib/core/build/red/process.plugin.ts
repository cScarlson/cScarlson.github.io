
import type { ToDo } from '@asxs/core/types';

type Options = { extension: string };

const { log } = console;

export function process(options: Partial<Options> = {}) {
    const { extension } = options;
    log(`@PLUGIN#RED#process`, options);
    let o;
    
    return o = {
        name: 'red-compiler',
        resolveFileUrl: (options: any) => {
            // if ( /^.+\.red\.html/img.test() ) return;
            // log(`@ROLLUP.process.generateBundle`, outputOptions.assetFileNames);
            // if ( !id.endsWith('.red.html') ) return code;
            log(`@ROLLUP.process.generateBundle`, options);
            // o.generateBundle = () => undefined;
        },
    };
};
