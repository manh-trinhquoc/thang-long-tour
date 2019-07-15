const { src, dest, watch, series, parallel } = require('gulp');

var SASS = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var browserSync = require('browser-sync');


function sass() {
    return src('app/scss/**')
        .pipe(sourcemaps.init())
        .pipe(SASS().on('error', SASS.logError)) // Using gulp-sass
        .pipe(sourcemaps.write(''))
        .pipe(dest('app/css/'))
}

function watchSaas(cb) {
    watch(['app/**', '!app/css/**'], { ignoreInitial: false }, sass);
    cb();
}

exports.default = function(cb) {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })
    watch(['app/**', '!app/css/**'], { ignoreInitial: false }, sass);
    watch(["app/**", '!app/scss/**'], function(cb) {
        browserSync.reload();
        cb();
    });
    cb();
}


exports.browserSync = function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })

    watch(["app/**", '!app/css/**', '!app/scss/**'], function(cb) {
        browserSync.reload();
        cb();
    });
}