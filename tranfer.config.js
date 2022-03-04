
import minimatch from 'minimatch';
import typescript from 'typescript';
import sass from 'sass';

const { log } = console;
const tagify = (tagName) => new RegExp(`(?:<${tagName}(.*)>)([\\s\\S]*)(?:<\\/${tagName}>)`, 'im');

class Transpiler {
    
    constructor(options = {}) {
        const {  } = { ...this, ...options };
        return this;
    }
    
    call(file, compilations) {
        const { contents, destination } = file;
        const isHTML = minimatch(destination, '**/*.vertex.html');
        const isTS = minimatch(destination, '**/*.ts');
        
        if (isHTML) return this['handle:*.vertex.html'](file);
        if (isTS)   return this['handle:*.ts'](file);
        return file;
    }
    
    ['handle:*.vertex.html'] = (file) => {
        const { destination, contents } = file;
        const style = tagify('style');
        const script = tagify('script');
        const [ a, attrsA, styles='' ] = contents.match(style) || [];
        const [ b, attrsB, scripts='' ] = contents.match(script) || [];
        const hasSASS = !!~attrsA.indexOf('lang="scss"');
        const hasTS = !!~attrsB.indexOf('lang="ts"');
        const css = this.desass(styles);
        const javascript = this.detypescript(scripts);
        
        log(`@${destination} hasSASS: ${hasSASS}, hasTS: ${hasTS}`, attrsA, attrsB);
        if (hasSASS && styles) file.contents = file.contents.replace(styles, `\n${css}`);
        if (hasTS && scripts) file.contents = file.contents.replace(scripts, `\n${javascript}`);
        
        return file;
    };
    
    ['handle:*.ts'] = (file) => {
        file.destination = file.destination.replace('.ts', '.js');
        file.contents = this.detypescript(file.contents);
        return file;
    };
    
    desass(code) {
        const { css } = sass.compileString(code);
        return css;
    }
    
    detypescript(code) {
        const { outputText: js } = typescript.transpileModule(code, {
            module: typescript.ModuleKind.CommonJS,
            target: typescript.ModuleKind.ESNext,
            // moduleResolution: typescript.ModuleKind.None
        });
        return js;
    }
    
}

export default {
    debug: false,
    source: './**/*.vertex.*',
    prefix: 'src',
    target: 'dist',
    bundled: './src/index.ts',
    preprocessors: [
        new Transpiler({  }),
    ],
    postprocessors: [ ],
    configure($args) {
        const { data: args } = $args;
        const { type } = args;
        const mode = {
            'prod': 'production',
            'qa':   'development',
            'dev':  'development',
            'mock': 'development',
        }[ type ];
        
        // console.log(`@tranfer.config#configure`, type);
        this.mode = mode;
        
        return this;
    },
    preprocess(compilations) {
        log(`@preprocess`);
    },
    prewrite(compilations) {
        log(`@prewrite`);
    },
    postwrite(compilations) {
        log(`@postwrite`);
    },
    postprocess(compilations) {
        log(`@postprocess`);
    },
};
