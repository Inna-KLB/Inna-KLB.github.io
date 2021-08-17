const gulp = require('gulp'),
      // sass = require('gulp-sass'),
      sass = require('gulp-sass')(require('sass')),
      autoprefixer = require('gulp-autoprefixer'),
      rename = require('gulp-rename'),
      // sourcemaps = require('gulp-sourcemaps'),
      browserSync = require('browser-sync').create(),
      cleanCss = require('gulp-clean-css'),
      clean = require('gulp-clean');
      // include = require('gulp-file-include'),
      // webpack = require('webpack-stream');

const src = './src/',
      dist = './dist/';

gulp.task('html', () => {
  return gulp.src(src +'**.html')
  // .pipe(include({
  //   prefix: '@@'
  // }))
  .pipe (gulp.dest(dist))
  .pipe(browserSync.stream());
});

gulp.task('sass', () => {
  return gulp.src(src + './sass/base/main.sass')
  // .pipe(sourcemaps.init())
  .pipe(sass({
    errorLogToConsole: true,
    outputStyle: 'compressed'
  }).on('error', console.error.bind(console)))
  .pipe(autoprefixer({
    overrideBrowserslist: ["last 5 versions"],
    cascade: false
  }))
  .pipe(cleanCss())
  .pipe(rename({
    suffix: '.min'
  }))
  // .pipe(sourcemaps.write('./'))
  .pipe (gulp.dest(dist + './css/'))
  .pipe(browserSync.stream());
});

gulp.task('img', () => {
  return gulp.src(src + './img/*.**')
  .pipe(gulp.dest(dist + './img'))
  .pipe(browserSync.stream());
});

gulp.task('fonts', () => {
  return gulp.src(src + './fonts/*.**')
  .pipe(gulp.dest(dist + './fonts'))
  .pipe(browserSync.stream());
});

gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: dist
    },
    port: 5000,
    notify: false
  })
});

gulp.task('watch-files', () => {
  gulp.watch(src + '**/*.html', gulp.parallel('html'));
  gulp.watch(src + '*.html', gulp.parallel('html'));
  gulp.watch(src + 'sass/**/*.sass', gulp.parallel('sass'));
  // gulp.watch(src + 'js/**/*.js', gulp.parallel('build-js'));
  gulp.watch(src + 'img/**/*.**', gulp.parallel('img'));
  gulp.watch(src + 'fonts/**/*.**', gulp.parallel('fonts'));
});


gulp.task('clean-folder', () => {
  return gulp.src(dist)
  .pipe(clean())
});

gulp.task('build', gulp.series('clean-folder', gulp.parallel('html', 'sass', 'img', 'fonts')));
gulp.task('default', gulp.parallel('watch-files', 'build', 'browser-sync'));