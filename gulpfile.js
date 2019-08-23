// variable change depend on project
let remotePath = "../server/gulp-build/";
let remoteGitPath = "../server/";
let commitMessage = " test git save github credentical";

//
const {
  src,
  dest,
  watch,
  series,
  parallel
} = require("gulp");

let SASS = require("gulp-sass");
let sourcemaps = require("gulp-sourcemaps");

let browserSync = require("browser-sync");

function sass() {
  // compile sass file to css. include map file
  return src("app/scss/**")
    .pipe(sourcemaps.init())
    .pipe(SASS().on("error", SASS.logError)) // Using gulp-sass
    .pipe(sourcemaps.write(""))
    .pipe(dest("app/css/"));
}

function watchSaas(cb) {
  // monitor scss file
  watch(["app/**", "!app/css/**"], {
    ignoreInitial: false
  }, sass);
  cb();
}

exports.default = function (cb) {
  // compile sass and reload browser if anything change
  browserSync.init({
    server: {
      baseDir: "app"
    }
  });
  watch(["app/**", "!app/css/**"], {
    ignoreInitial: false
  }, sass);
  watch(["app/**", "!app/scss/**"], function (cb) {
    browserSync.reload();
    cb();
  });
  cb();
};

exports.browserSync = function () {
  // reload browser if anything change. exclude scss file
  browserSync.init({
    server: {
      baseDir: "app"
    }
  });

  watch(["app/**", "!app/css/**", "!app/scss/**"], function (cb) {
    browserSync.reload();
    cb();
  });
};

function copy() {
  return src(["app/**/*", "!app/scss/**"], {
    base: "app"
  }).pipe(dest(remotePath));
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
let git = require("gulp-git");
// Run git add
// src is the file(s) to add (or ./*)
function add() {
  return src(".").pipe(git.add());
}

exports.gitadd = add;

function commit() {
  return (
    src("./")
    // ********************************************************************
    // commit develope folder
    .pipe(git.commit(commitMessage))
  );
}

exports.gitcommit = commit;

function push(cb) {
  git.push("origin", "master", function (err) {
    if (err) throw err;
  });
  cb();
}

exports.gitpush = push;

//do 3 action in series
exports.github = series(add, commit, push);

// git in a different folder

function addremote() {
  process.chdir(remoteGitPath);
  return src(".").pipe(git.add());
}

exports.gitaddremote = addremote;

function commitremote() {
  process.chdir(remoteGitPath);
  return (
    src("./")
    // ********************************************************************
    // commit distribution folder
    .pipe(git.commit(commitMessage))
  );
}

exports.gitcommitremote = commitremote;

function pushremote(cb) {
  process.chdir(remoteGitPath);
  git.push("origin", "master", function (err) {
    if (err) throw err;
  });
  cb();
}

exports.gitpushremote = pushremote;

//do 3 action in series
exports.githubremote = series(addremote, commitremote, pushremote);

// delete files programmatically
let del = require("del");

function clean() {
  return del([remotePath + "**/*"], {
    force: true
  });
}

exports.clean = clean;

//build task include everything

exports.build = series(
  series(add, commit, push),
  series(clean, copy, addremote, commitremote, pushremote)
);