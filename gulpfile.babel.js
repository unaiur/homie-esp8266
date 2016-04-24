'use strict';

import gulp from 'gulp';
import plumber from 'gulp-plumber'; // help to avoid crash if error in a task
import newer from 'gulp-newer';
import watch from 'gulp-watch'; // gulp.watch doesn't detect new files
import del from 'del'; // delete files
import imagemin from 'gulp-imagemin';
import runSequence from 'run-sequence';
import notifier from 'node-notifier';
import uglify from 'gulp-uglify';
import rollup from 'gulp-rollup';
import rollupNodeResolve from 'rollup-plugin-node-resolve';
import rollupCommonjs from 'rollup-plugin-commonjs';
import rollupBabel from 'rollup-plugin-babel';
import rollupReplace from 'rollup-plugin-replace';

let errored = false;
let errorHandler = function (task) {
  return function (error) {
    errored = true;
    console.log(`Error in ${task}: ${error.message}`);
    notifier.notify({
      title: `Error in ${task}`,
      message: error.message
    });
  };
};

//  ################
//  # Entry points #
//  ################

gulp.task('dev', ['buildpublic:dev'], function (done) {
  watch('./app/assets/**/*', function (vinyl) {
    console.log(`${vinyl.path} was ${vinyl.event}, piping to public/...`);
    runSequence('assets');
  });

  watch('./app/vendor/**/*', function (vinyl) {
    console.log(`${vinyl.path} was ${vinyl.event}, piping to public/vendor/...`);
    runSequence('vendor');
  });

  watch('./app/js/**/*.js', function (vinyl) {
    console.log(`${vinyl.path} was '${vinyl.event}', running Babel...`);
    runSequence('es6-7:dev');
  });
});

gulp.task('dist', function (done) {
  runSequence('buildpublic:dist', function () {
    if (errored) {
      console.log('Distribution failed');
      process.exit(-1);
    }
  });
});

//  ####################
//  # public directory #
//  ####################

gulp.task('buildpublic:dist', function (done) {
  runSequence(
    'buildpublic:clear',
    ['assets', 'vendor', 'es6-7:dist'],
    'buildpublic:imagemin',
  done);
});

gulp.task('buildpublic:dev', function (done) {
  runSequence(
    'buildpublic:clear',
    ['assets', 'vendor', 'es6-7:dev'],
  done);
});

gulp.task('buildpublic:clear', function (done) {
  del(['./public/**/*']).then(function () {
    done();
  });
});

gulp.task('buildpublic:imagemin', function () {
  return gulp.src('./public/img/**/*.{png,jpg,gif,svg}', {
    base: './public'
  })
    .pipe(plumber(errorHandler('buildpublic:imagemin')))
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('./public'));
});

// Babel

let es67 = (prod = false) => {
  let env = 'development';
  if (prod) {
    env = 'production';
  }

  const plugins = [
    rollupBabel({ babelrc: false, exclude: './node_modules/**', presets: ['es2015-rollup', 'stage-3', 'react'] }),
    rollupNodeResolve({ jsnext: true, main: true, browser: true }),
    rollupCommonjs({ include: './node_modules/**' }),
    rollupReplace({ 'process.env.NODE_ENV': JSON.stringify(env) })
  ];

  return gulp.src('./app/js/app.js', {read: false})
    .pipe(rollup({
      format: 'iife',
      plugins
    }))
    .pipe(plumber(errorHandler('es6-7')));
};

gulp.task('es6-7:dev', function () {
  return es67()
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('es6-7:dist', function () {
  return es67(true)
    .pipe(uglify())
    .pipe(gulp.dest('./public/js/'));
});

// assets and vendor

gulp.task('assets', function () {
  return gulp.src('./app/assets/**/*', {
    base: './app/assets'
  })
    .pipe(plumber(errorHandler('assets')))
    .pipe(newer('./public'))
    .pipe(gulp.dest('./public'));
});

gulp.task('vendor', function () {
  return gulp.src('./app/vendor/**/*', {
    base: './app'
  })
    .pipe(plumber(errorHandler('vendor')))
    .pipe(newer('./public'))
    .pipe(gulp.dest('./public'));
});
