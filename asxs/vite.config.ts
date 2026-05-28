
import { defineConfig } from 'vite';
import { default as tsconfigPaths } from 'vite-tsconfig-paths';
// import { copy } from '@web/rollup-plugin-copy';
// import { default as copy } from 'rollup-plugin-copy';
import { process as processREDFile } from './src/lib/core/build/red/process.plugin';

const { log } = console;
const EXTENSION = `.red.html`;

function transform(contents: Buffer, filename: string): Buffer {
    if ( !filename.endsWith('.red.html') ) return contents;
    if ( !contents.toString('utf8').includes('<script type="text/typescript">') ) return contents;
    const html = contents.toString('utf8');
    
    log(`@@@@@@@@@@@@@@@\n`, filename, html);
    return contents;
}

export default defineConfig({
    plugins: [
        tsconfigPaths(),
        // copy({ patterns: `./app/**/*${EXTENSION}`, rootDir: './src', exclude: [] }),
        // processREDFile({ extension: EXTENSION }),
        // {
        //     ...copy({
        //         // patterns: [`./app/**/*${EXTENSION}`],
        //         // rootDir: './src',
        //         targets: [
        //             { src: `./src/app/**/*${EXTENSION}`, dest: './dist/____', transform },
        //         ]
        //     }),
        //     name: 'as-frameless-red-transpiler',
        //     enforce: 'post',
        // }
    ],
    build: {
        outDir: 'docs',
        emptyOutDir: true,  // optional: Empty the output directory before building
    }
});
