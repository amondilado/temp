const { src, dest, watch, series } = require('gulp');

const sass = require("gulp-sass"),
  sourcemaps = require("gulp-sourcemaps"),
  browserSync = require("browser-sync").create();

const path = {
  src: "./",
  dist: "./css/"
};

// Compile sass to css
function css() {
  return src(path.src + 'scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write())
    .pipe(dest(path.dist))
    .pipe(browserSync.stream());
}

function reload() {
  browserSync.reload();
}

function watchtask() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  watch(path.src + 'scss/**/*.scss', css);
}

exports.default = series(css, watchtask);
exports.css = css;