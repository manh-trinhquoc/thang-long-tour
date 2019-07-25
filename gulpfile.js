const { src, dest, watch, series, parallel } = require('gulp');

var SASS = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var browserSync = require('browser-sync');


function sass() {
    // compile sass file to css. include map file
    return src('app/scss/**')
        .pipe(sourcemaps.init())
        .pipe(SASS().on('error', SASS.logError)) // Using gulp-sass
        .pipe(sourcemaps.write(''))
        .pipe(dest('app/css/'))
}

function watchSaas(cb) {
    // monitor scss file
    watch(['app/**', '!app/css/**'], { ignoreInitial: false }, sass);
    cb();
}

exports.default = function(cb) {
    // compile sass and reload browser if anything change
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
    // reload browser if anything change. exclude scss file
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    });

    watch(["app/**", '!app/css/**', '!app/scss/**'], function(cb) {
        browserSync.reload();
        cb();
    });
};

function copy() {
    return src(['app/**/*', '!app/scss/**'], {
        base: 'app'
    }).pipe(dest('F://gulp-build/'));
}

exports.copy = copy;

/**
 * Push to git hub width ghPages
 */
// let ghPages = require('gulp-gh-pages');

// exports.github = function() {
//     return src(['**/*', '.gitignore', '!node_modules/', '!.git', '!package-lock.json'])
//         .pipe(ghPages({ branch: 'master' }))
// };

// git with gulp-git
let git = require('gulp-git');
// Run git add
// src is the file(s) to add (or ./*)
function add() {
    return src('.')
        .pipe(git.add());
}

exports.gitadd = add;

function commit() {
    return src('./')
        .pipe(git.commit('test gulp-git add commit push in exports.build 2'));
}

exports.gitcommit = commit;

function push(cb) {
    git.push('origin', 'master', function(err) {
        if (err) throw err;
    });
    cb();
}

exports.gitpush = push;

//do 3 action in series
exports.github = series(add, commit, push);

// git in a different folder 
function addremote() {
    return src(['.'], {
            base: 'F://gulp-build'
        })
        .pipe(git.add());
}

exports.gitaddremote = addremote;

// delete files programmatically
let del = require('del');

function clean() {
    return del(['F://gulp-build/**/*'], {
        force: true
    });
}

exports.clean = clean;