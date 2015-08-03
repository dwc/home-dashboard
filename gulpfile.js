var gulp = require('gulp');
var path = require('path');
var webserver = require('gulp-webserver');

var PATHS = {
  SRC: 'src/**/*.js',
  PUBLIC: 'public/**/*',
  DEST: 'dist'
};

gulp.task('build-js', function () {
  var files = [
    PATHS.SRC,
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/xively-js/xivelyjs-*.min.js'
  ];

  gulp.src(files)
    .pipe(gulp.dest(path.join(PATHS.DEST, 'js')));
});

gulp.task('copy-public', function() {
  gulp.src(PATHS.PUBLIC)
    .pipe(gulp.dest(PATHS.DEST));
});

gulp.task('build', [ 'build-js', 'copy-public' ]);

gulp.task('watch', function() {
  gulp.watch([ PATHS.SRC ], [ 'build-js' ]);
  gulp.watch([ PATHS.PUBLIC ], [ 'copy-public' ]);
});

gulp.task('server', function() {
  gulp.src(PATHS.DEST)
    .pipe(webserver({
      livereload: true
    }));
});

gulp.task('default', [ 'build', 'watch', 'server' ]);
