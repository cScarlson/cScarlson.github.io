
import gulp from 'gulp';
import bs from 'browser-sync';

const { log } = console;
const browserSync = bs.create();

function serve() {
    browserSync.init({
        server: { baseDir: './' }
    });

    gulp.watch('./**/*').on( 'change', (uri, stats) => browserSync.reload() );
}

gulp.task('serve', serve);
