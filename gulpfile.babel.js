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

/**
 * Proccess sass files and es2015 files.
 */
gulp.task('build', ['sass', 'es2015ToCommonJS']);

/**
 * starts a watcher looking for any changes in the app js files
 */
gulp.task('watch', () => {
    gulp.watch(SASS_PATH, ['build']);
});


/**
 * compile all sass resources into css ones.
 */
gulp.task('sass', () => {
  return gulp.src(SASS_PATH)
    .pipe(sass({
        style: 'compressed',
        errLogToConsole: false,
        onError: function(err) {
            return notify().write(err);
        }
    })).pipe(gulp.dest(CSS_PATH));
});

/**
 * Converts all the files wrote with ES2015 insto common js files to be accessible by the browser
 */
gulp.task('es2015ToCommonJS', () => {
  return gulp.src('./**/*.es2015.js')
      .pipe(rename(function(path) {
        //path.dirname += "/dist";
        path.basename = path.basename.split('.es2015')[0]; //removes babel from the basename (e.g.: app.babel => app)
        path.extname = ".js"
      }))
      .pipe(babel())
      .pipe(gulp.dest('./'));
});