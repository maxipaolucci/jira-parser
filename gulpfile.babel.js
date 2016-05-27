"use strict";

import gulp from "gulp";
import runSequence from "run-sequence"; //for run task in order and not in parallel
import sass from "gulp-sass"; //for compile sass
import babel from "gulp-babel";
import rename from "gulp-rename";
import browserify from "browserify";
import source from "vinyl-source-stream";

//CSS and SCSS paths
const MAIN_SASS_RES = './public/css/src/*.scss'; //get main sass resources
const COMP_SASS_RES = './public/js/directives/**/*.scss'; //get directives sass resources
const ALL_SASS_RES = [MAIN_SASS_RES, COMP_SASS_RES]; //get all sass resources
const CSS_PATH = './public/css'; //css path

//JS paths
const SERVER_JS_RES = './*.es2015.js'; //get js resources in server
const CLIENT_JS_RES = './public/**/*.es2015.js'; //get js resources in public
const ALL_JS_RES = [SERVER_JS_RES, CLIENT_JS_RES]; //get all js resources
const PUBLIC_PATH = './public'; //path to public
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
  gulp.watch(ALL_SASS_RES, ['sass']);
  gulp.watch(ALL_JS_RES, ['es2015ToCommonJS']);
});

/**
 * compile all sass resources into css ones.
 */
gulp.task('sass', () => {
  return gulp.src(MAIN_SASS_RES)
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
gulp.task('es2015ToCommonJS', (callback) => {
  runSequence('es2015ToCommonJSTranslation', 'mainJSGeneration', callback);
});

/**
 * Translates all the ES2015 files into Common JS files in the server as well as in the client
 */
gulp.task('es2015ToCommonJSTranslation', () => {
  //this one if for the server (it doesn't group dependencies)
  gulp.src(SERVER_JS_RES)
    .pipe(rename(function(path) {
      //path.dirname += "/dist";
      path.basename = path.basename.split('.es2015')[0]; //removes babel from the basename (e.g.: app.babel => app)
      path.extname = ".js"
    }))
    .pipe(babel())
    .pipe(gulp.dest('./'));

  return gulp.src(CLIENT_JS_RES)
    .pipe(rename(function(path) {
      //path.dirname += "/dist";
      path.basename = path.basename.split('.es2015')[0]; //removes babel from the basename (e.g.: app.babel => app)
      path.extname = ".js"
    }))
    .pipe(babel())
    .pipe(gulp.dest(PUBLIC_PATH));
});

/**
 * Translates the main.js file in the client from ES2015 to Common JS using babel but also includes all the required files from this one inside it.
 * Thanks to this task we do not need to include all the javascript resources in the index.html
 */
gulp.task('mainJSGeneration', () => {
  
  return browserify('public/js/main.es2015.js')
    .transform('babelify')
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('public/js'));
});