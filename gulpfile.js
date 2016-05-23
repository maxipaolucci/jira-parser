var gulp = require('gulp'),
    runSequence = require('run-sequence'), //for run task in order and not in parallel
    sass = require('gulp-sass'); //for compile sass

var SASS_PATH = './public/css/src/*.scss';
var CSS_PATH = './public/css';

/**
 * Default task when just type gulp. Makes the build, starts watchers
 */
gulp.task('default', function(callback) {
    runSequence('build', 'watch', callback);
});

gulp.task('build', function(callback) {
  runSequence('sass', callback);
});


/**
 * starts a watcher looking for any changes in the app js files
 */
gulp.task('watch', function() {
    gulp.watch(SASS_PATH, ['build']);
});


/**
 * compile all sass resources into css ones.
 */
gulp.task('sass', function () {
  return gulp.src(SASS_PATH)
    .pipe(sass({
        style: 'compressed',
        errLogToConsole: false,
        onError: function(err) {
            return notify().write(err);
        }
    })).pipe(gulp.dest(CSS_PATH));
});
