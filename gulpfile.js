
import gulp from 'gulp';
import bs from 'browser-sync';

const { log } = console;
const browserSync = bs.create();

function serve() {
    browserSync.init({
        server: { baseDir: './' },
        port: 3000,
    });

    gulp.watch('./**/*').on( 'change', (uri, stats) => browserSync.reload() );
}

gulp.task('serve', serve);
