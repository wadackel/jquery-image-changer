gulp = require("gulp")
$ = do require("gulp-load-plugins")
marked = require("marked")


gulp.task("sass", ->
  gulp.src("./src/sass/**/*.scss")
  .pipe($.plumber())
  .pipe($.sass.sync(
    outputStyle: "compressed"
  ).on("error", $.sass.logError))
  .pipe($.autoprefixer())
  .pipe(gulp.dest("./css"))
)


gulp.task("jade", ->
  gulp.src("./src/jade/**/*.jade")
  .pipe($.plumber())
  .pipe($.jade(
    pretty: true
  ))
  .pipe(gulp.dest("./"))
)


gulp.task("default", ->

  $.watch("./src/sass/**/*.scss", ->
    gulp.start("sass")
  )

  $.watch("./src/jade/**/*.jade", ->
    gulp.start("jade")
  )
)