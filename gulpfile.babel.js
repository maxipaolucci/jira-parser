"use strict";

import gulp from "gulp";
import runSequence from "run-sequence"; //for run task in order and not in parallel
import sass from "gulp-sass"; //for compile sass
import babel from "gulp-babel";
import rename from "gulp-rename";

let SASS_PATH = './public/css/src/*.scss';
let CSS_PATH = './public/css';

/**
 * Default task when just type gulp. Makes the build, starts watchers
 */
gulp.task('default', (callback) => {
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

gulp.task('es2015ToCommonJS', () => {
  gulp.src('./**/*.es2015.js')
      .pipe(rename(function(path) {
        //path.dirname += "/dist";
        path.basename = path.basename.split('.es2015')[0]; //removes babel from the basename (e.g.: app.babel => app)
        path.extname = ".js"
      }))
      .pipe(babel())
      .pipe(gulp.dest('./'));
});