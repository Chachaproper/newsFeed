'use strict';

const gulp       = require('gulp');
const babel      = require('babelify');
const gulpif     = require('gulp-if');
const browserify = require('browserify');
const source     = require('vinyl-source-stream');
const uglify     = require('gulp-uglify');
const envify     = require('envify/custom');
const buffer     = require('vinyl-buffer');
const sass       = require('gulp-sass');
const prefixer   = require('gulp-autoprefixer');
const sourceMaps = require('gulp-sourcemaps');


const dev       = process.env.NODE_ENV !== 'production';
const sassPath  = './styles/**/*.sass';
const jsVendors = [
  'react',
  'react-dom',
  'whatwg-fetch',
  'lodash'
];

console.log('DEV MODE = ' + dev);

gulp
  .task('js:vendor', () => {
    const b = browserify({
      debug: dev
    })
      .ignore('buffertools');

    jsVendors.forEach(lib => {
      b.require(lib);
    });

    b.bundle()
      .pipe(source('vendorBundle.js'))
      .pipe(buffer())
      .pipe(gulpif(!dev, uglify()))
      .pipe(gulp.dest('dist/js'))
  })

  .task('js:app', () => {
    return browserify({
      entries:    './frontend/app.js',
      extensions: [' ', 'js', 'jsx'],
      debug:      dev
    })
      .external(jsVendors)
      .transform(babel.configure({
        presets: ['es2015', 'react']
      }))
      .transform(envify({
        NODE_ENV: process.env.NODE_ENV
      }))
      .on('error', (err) => {
        console.log(err);
      })
      .bundle()
      .pipe(source('appBundle.js'))
      .pipe(buffer())
      .pipe(gulpif(!dev, uglify()))
      .pipe(gulp.dest('dist/js'))
  })

  .task('sass', () => {
    return gulp.src(sassPath)
      .pipe(gulpif(dev, sourceMaps.init()))
      .pipe(sass({outputStyle: 'compressed'}))
      .pipe(prefixer({
        browsers: [
          '> 1%',
          'last 2 versions',
          'IE 10',
          'IE 11'
        ],
        cascade:  false
      }))
      .pipe(gulpif(dev, sourceMaps.write()))
      .pipe(gulp.dest('./dist/css/'))
  })

  .task('watch', () => {
    gulp.watch(sassPath, ['sass']);
    gulp.watch('./frontend/**/*.js', ['js:app']);
  })

  .task('build', [
    'sass',
    'js:vendor',
    'js:app'
  ])

  .task('default', [
    'build',
    'watch'
  ]);
