gulp = require "gulp"
$ = do require "gulp-load-plugins"
pkg = require "./package.json"
del = require "del"
runSequence = require "run-sequence"
marked = require "marked"


banner = """
/*!
 * <%= pkg.name %>
 * author: <%= pkg.author %>
 * version: <%= pkg.version %>
 * license: <%= pkg.license %>
 * copyright: <%= pkg.author %>
 */

"""


# ======================================
# src tasks
# ======================================
gulp.task "scripts", ->
  gulp.src "./src/jquery.image-changer.js"
  .pipe $.plumber()
  .pipe $.jshint()
  .pipe $.header banner, pkg: pkg
  .pipe gulp.dest "./dist"
  .pipe gulp.dest "./gh-pages/js"


gulp.task "uglify", ->
  gulp.src "./dist/*.js"
  .pipe $.rename extname: ".min.js"
  .pipe $.uglify preserveComments: "some"
  .pipe gulp.dest "./dist"


gulp.task "test", ->
  gulp.src "./test/index.html"
  .pipe $.qunit timeout: 5


gulp.task "clean", (cb) ->
  del "./dist", cb


# ======================================
# gh-pages tasks
# ======================================
gulp.task "demo:sass", ->
  gulp.src "./gh-pages/src/sass/**/*.scss"
  .pipe $.plumber()
  .pipe $.sass.sync(outputStyle: "compressed").on "error", $.sass.logError
  .pipe $.autoprefixer()
  .pipe gulp.dest "./gh-pages/css"


gulp.task "demo:jade", ->
  gulp.src "./gh-pages/src/jade/**/*.jade"
  .pipe $.plumber()
  .pipe $.jade pretty: true
  .pipe gulp.dest "./gh-pages"


gulp.task "demo:deproy", ->
  gulp.src "./gh-pages/**/*"
  .pipe $.ghPages()


# ======================================
# Build & Default tasks
# ======================================
gulp.task "default", ["scripts"], ->
  $.watch "./src/*.js", ->
    gulp.start "scripts"

  $.watch "./test/*.js", ->
    gulp.start "test"

  $.watch "./gh-pages/src/sass/**/*.scss", ->
    gulp.start "demo:sass"

  $.watch "./gh-pages/src/jade/**/*.jade", ->
    gulp.start "demo:jade"


gulp.task "build", (cb) -> runSequence(
  "clean",
  "scripts",
  "uglify",
  [
    "test"
    "demo:sass"
    "demo:jade"
  ],
  cb
)
