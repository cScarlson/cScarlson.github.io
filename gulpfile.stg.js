
import gulp from 'gulp';
import bs from 'browser-sync';
import config from './gulpfile.config.js';

const { log } = console;
const browserSync = bs.create();

function serve() {
    browserSync.init({
        ...config,
        port: 3001,
    });

    gulp.watch('./**/*').on( 'change', (uri, stats) => browserSync.reload() );
}

gulp.task('serve', serve);
