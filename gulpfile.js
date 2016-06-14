
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var bs = require('browser-sync').create();
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-spawn-mocha');
var Server = require('karma').Server;

gulp.task('client-test', function(done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('server-test', function(done) {
  return gulp.src('./specs/unit/server/ServerSpec.js', {read: false})
  // gulp-mocha needs filepaths so you can't have any plugins before it
  .pipe(mocha({reporter: 'spec'}));
});

gulp.task('browser-sync', ['nodemon'], function() {
  bs.init(null, {
    proxy: "http://localhost:3000",
    browser: "google chrome",
    port: 4000,
  });
});

// the real stuff
gulp.task('default', ['browser-sync'], function () {
  // gulp.watch('./client/**/*.*', ['bs-delay', 'client-test']);
  // gulp.watch('./specs/unit/client/**/*.*', ['client-test']);
  // gulp.watch('./server/**/*.js', ['bs-delay', 'server-test']);
  // gulp.watch('./specs/unit/server/**/*.js', {interval: 5000}, ['server-test']);
    gulp.watch('./client/**/*.*', ['bs-delay']);
  gulp.watch('./specs/unit/client/**/*.*');
  gulp.watch('./server/**/*.js', ['bs-delay']);
  gulp.watch('./specs/unit/server/**/*.js', {interval: 5000});
});

// give nodemon time to restart
gulp.task('bs-delay', function () {
  setTimeout(function () {
    bs.reload({ stream: false });
  }, 1000);
});

// our gulp-nodemon task
gulp.task('nodemon', function (cb) {
  var started = false;
  return nodemon({
    script: './index.js',
    ext: 'js'
  }).on('start', function () {
    //avoid nodemon being started multiple times
    if (!started) {
      cb();
      started = true;
    }
  })
  .on('crash', function() {
    console.log('nodemon.crash');
  })
  .on('restart', function() {
    console.log('nodemon.restart');
  })
  .once('quit', function () {
    // handle ctrl+c without a big weep
    process.exit();
  });
});

gulp.task('lint', function() {
  return gulp.src('public/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('concat', function() {
  return gulp.src(['./client/*.js', './server/*/**.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('uglify', function() {
  return gulp.src('./dist/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
});
