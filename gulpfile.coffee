gulp          = require "gulp"
$             = do require "gulp-load-plugins"
$.pkg         = require "./package.json"
$.del         = require "del"
$.runSequence = require "run-sequence"


banner = """
/*!
 * <%= pkg.name %>
 * author: <%= pkg.author %>
 * version: <%= pkg.version %>
 * license: <%= pkg.license %>
 * copyright: <%= pkg.author %>
 */

"""

gulp.task "scripts", ->
  gulp.src "src/jquery.image-changer.js"
  .pipe $.plumber()
  .pipe $.jshint()
  .pipe $.header banner, pkg: $.pkg
  .pipe gulp.dest "dist"


gulp.task "uglify", ->
  gulp.src "dist/*.js"
  .pipe $.rename extname: ".min.js"
  .pipe $.uglify preserveComments: "some"
  .pipe gulp.dest "dist"


gulp.task "test", ->
  gulp.src "test/index.html"
  .pipe $.qunit timeout: 5


gulp.task "clean", (cb) ->
  $.del "dist", cb


gulp.task "default", ["scripts"], ->
  $.watch "src/*.js", ->
    gulp.start "scripts"

  $.watch "test/*.js", ->
    gulp.start "test"


gulp.task "build", (cb) -> $.runSequence(
  "clean",
  "scripts",
  "uglify"
  "test"
  cb
)
