const gulp         = require("gulp"),
      sass         = require("gulp-sass"),
      rename       = require("gulp-rename"),
      cleanCSS     = require("gulp-clean-css"),
      autoprefixer = require('gulp-autoprefixer'),
      maps         = require("gulp-sourcemaps"),
      notify       = require('gulp-notify'),
      runSequence  = require("run-sequence");
      browserSync  = require('browser-sync').create(),
      reload       = browserSync.reload;

var root = "./css//**/";
var input = "./css/";
var output = "./css";
var outputMinify = "./css/min";

gulp.task("sass-compile", function() {
  return gulp 
    .src(input + "*.scss")
    .pipe(maps.init()) // create maps from scss partials
    .pipe(sass())
    .pipe(maps.write("./")) // this path is relative to the output directory
    .pipe(gulp.dest(output)) // this is the output directory
    .pipe(notify({ message: 'SASS compiled sucessfully', onLast: true}))
    .pipe(reload({stream: true}));

});

gulp.task("minify-css", function() {
  return gulp
    .src(input + "*.css")
    .pipe(maps.init({ loadMaps: true })) // create maps from scss *sourcemaps* not the css
    .pipe(autoprefixer('last 3 version'))
    .on('error', function (err) { console.log(err.message); })
    .pipe(cleanCSS())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(maps.write("./"))
     .pipe(gulp.dest(outputMinify))
     .pipe(notify({ message: 'SASS minification sucessful', onLast: true }))
    .pipe(reload({ stream: true }));
});

// listening for changes to scss and images - 'gulp watch'
gulp.task('watch', function() {
  gulp.watch(root + '*.scss', ['sass-compile']);
  });

// live reload via browser-sync - 'gulp serve'
gulp.task('serve', function() {
  gulp.watch(root + '*.scss', ['sass-compile']);
  gulp.watch('**/*.html').on('change', reload);
});

gulp.task("default", function(done) {
    runSequence("sass-compile", "minify-css", "watch" , done);
});
