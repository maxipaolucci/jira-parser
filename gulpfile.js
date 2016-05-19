var gulp = require('gulp'),
    sass = require('gulp-sass'); //for compile sass


/**
 * Default task when just type gulp. Makes the build, starts watchers and start the server on localhost:3000
 */
gulp.task('default', function(callback) {
    runSequence('sass', 'watch', callback);
});


/**
 * starts a watcher looking for any changes in the app js files
 */
gulp.task('watch', function() {
    gulp.watch(config.ang_files.src_sass, ['ang-build']);
    gulp.watch(config.ang_files.src_html, ['ang-build']);
    gulp.watch(config.ang_files.src_js, ['ang-lint', 'ang-build']);
});


/**
 * compile all sass resources into css ones.
 */
gulp.task('sass', function () {
  return gulp.src('./public/css/*.scss')
    .pipe(sass({
        style: 'compressed',
        errLogToConsole: false,
        onError: function(err) {
            return notify().write(err);
        }
    })).pipe(gulp.dest('./public/css'));
});
