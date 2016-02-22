var gulp = require("gulp");
var path = require("path");

var PATHS = {
  SRC: "src/**/*.js",
  PUBLIC: "public/**/*",
  CONFIGURATION: "configuration/**/*",
  DEST: "dist"
};

gulp.task("build-js", function () {
  var files = [
    PATHS.SRC,
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/d3/d3.min.js"
  ];

  gulp.src(files)
    .pipe(gulp.dest(path.join(PATHS.DEST, "js")));
});

gulp.task("copy-public", function() {
  gulp.src(PATHS.PUBLIC)
    .pipe(gulp.dest(PATHS.DEST));
});

gulp.task("copy-configuration", function() {
  gulp.src(PATHS.CONFIGURATION)
    .pipe(gulp.dest(PATHS.DEST));
});

gulp.task("build", [ "build-js", "copy-public", "copy-configuration" ]);

gulp.task("watch", function() {
  gulp.watch([ PATHS.SRC ], [ "build-js" ]);
  gulp.watch([ PATHS.PUBLIC ], [ "copy-public" ]);
  gulp.watch([ PATHS.CONFIGURATION ], [ "copy-configuration" ]);
});

gulp.task("default", [ "build", "watch" ]);
