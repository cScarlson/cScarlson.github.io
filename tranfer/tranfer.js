
import { globby } from 'globby';
import { Arguments } from 'utilities/argv.js';
import { Deferred } from 'utilities/patterns/other/deferred.js';
import path from 'path';
import url from 'url';
import fs from 'fs/promises';
import jetpack from 'fs-jetpack';
import bundle from 'webpack';
import noop from './console.js';
import webpack from './webpack.config.js';
import configuration from '../tranfer.config.js';

const { argv } = process;
const { dirname } = path;
const { fileURLToPath } = url;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CWD = process.cwd();
const $args = new Arguments(argv);
const DEFAULT_CONFIGURATION = {
    source: '',
    prefix: '',
    target: '',
    preprocessors: [ ],
    postprocessors: [ ],
    configure($args) { return this },
    preprocess: (compilations) => compilations,
    prewrite: (compilations) => compilations,
    postwrite: (compilations) => compilations,
    postprocess: (compilations) => compilations,
};

function execute(config) {  // todo: decouple. bind config instead of declaring functions within.
    var config = { ...DEFAULT_CONFIGURATION, ...configuration, ...config };  // assume tranfer.config.js. overwrite with options.
    const { console: native } = global;
    const { source, prefix, target, preprocessors, postprocessors } = config;
    const console = config.debug === true ? native : noop;  // if undefined or false or otherwise: noop.
    const targets = path.join(prefix, source).replaceAll('\\', '/');
    const compilations = { config: config.configure($args), $files: new Map() };  // call `configure()`
    const $read = read.apply.bind(read, compilations.$files);  // adapter
    const $preprocess = preprocess.apply.bind(preprocess, compilations);  // adapter
    const $write = write.apply.bind(write, compilations);  // adapter
    const $postprocess = postprocess.apply.bind(postprocess, compilations);  // adapter
    const paths = globby(targets);
    const files = paths
        .then($read)
        .then( files => config.preprocess(compilations) )  // call preprocess once after final read.
        .then( result => compilations.$files )
        ;
    const presults = files
        .then(map => [ ...map.values() ])
        .then($preprocess)
        .then( final => config.prewrite(compilations) )  // call prewrite once after final preprocess.
        ;
    const written = presults
        .then( final => files )
        .then(map => [ ...map.values() ])
        .then($write)
        .then( final => config.postwrite(compilations) )  // call postwrite once after final write.
        ;
    const postresults = written
        .then( final => files )
        .then(map => [ ...map.values() ])
        .then($postprocess)
        .then( final => config.postprocess(compilations) )  // call postprocess once after final postprocess.
        ;
    const completed = postresults
        .then(final => compilations)
        ;
    const ready = completed
        .then(pack)
        .then(compilations => compilations)
        ;
    const finished = ready;// ready.then( c => process.exit(0) );
    
    function read(path, ...more) {
        const promise = fs.readFile(path, 'utf8');
        const destination = path.replace(prefix, target);
        const file = { path, destination, original: destination };
        
        if (destination === path && !~destination.indexOf(target)) file.destination = `${target}/${path}`;  // for files outside of `context`.
        return promise.then( contents => this.set(path, { ...file, contents }) )
            .then( map => more.length ? read.apply(map, more) : map )
            ;
    }

    function preprocess(file, ...more) {
        const final = run.call(this, file, ...preprocessors);
        if (more.length) return preprocess.apply(this, more);
        return final;
    }

    function write(file, ...more) {
        const { contents, destination } = file;
        
        jetpack.write(destination, contents);
        if (more.length) return write.apply(this, more);
        return file;
    }

    function postprocess(file, ...more) {
        const final = run.call(this, file, ...postprocessors);
        if (more.length) return postprocess.apply(this, more);
        return final;
    }
    
    function pack(compilations) {
        const { config } = compilations;
        const { bundled, mode='production' } = config;
        const deferred = new Deferred();
        const entry = path.resolve(CWD, bundled).replace(CWD, '.').replaceAll('\\', '/');
        const options = { ...webpack, entry, mode };
        
        function handleBundlerFinished(error, stats) {
            const { compilation } = stats;
            const { errors } = compilation;
            
            if (error) return native.error(`@WEBPACK:error`, error);
            if ( stats.hasErrors() ) return native.error(`@WEBPACK:has-error`, entry, errors);
            
            // native.error(`@WEBPACK:success`, entry);
            deferred.resolve(stats);
        }
        
        // native.log(`@PACK`, config);
        bundle(options, handleBundlerFinished);
        
        return deferred.promise;
    }

    function run(file, task, ...more) {
        if (!file) return Promise.resolve(file);
        if (!task) return Promise.resolve(file);
        const result = task.call(file, this);
        const promise = Promise.resolve(result).then(log);  // ensure any | Promise<any> is always Promise<any>
        
        if (more.length) return promise.then( file => run(file, ...more) );
        return promise;
    }

    function log(result) {
        console.log('smile:log', result);
        return Promise.resolve(result);
    }
    
    return finished;
}

export default execute;
