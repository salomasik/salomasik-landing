const { series } = require('gulp');
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug')
const sass = require('gulp-sass')(require('sass'));
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf'); // rimraf directly
const rename = require("gulp-rename");

// Static server
gulp.task('server', function () {
    browserSync.init({
        server: {
            port:9000,
            baseDir: "build"
        }
    });

gulp.watch('build/**/*').on('change',browserSync.reload);
});
// Get html in build 
gulp.task('templates_compile', function () {
    return gulp.src('source/templates/index.pug')
      .pipe(
        pug({
          // Your options in here.
          pretty:true
        }))
      .pipe(gulp.dest('build'));
  });
// Get style in build 
gulp.task('styles_compile', function buildStyles() {
    return gulp.src('source/styles/**/*.scss')
      .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
      .pipe(rename("main.min.css"))
      .pipe(gulp.dest('build/css'));
  });
//   Get spritesmith
gulp.task('sprite', function (cb) {
    const spriteData = gulp.src('source/img/icons/*.png').pipe(spritesmith({
      imgName: 'sprite.png',
      imgPath:'../img/sprite.png',
      cssName: 'sprite.scss'
    }));

     spriteData.img.pipe(gulp.dest('build/images/')); 
     spriteData.css.pipe(gulp.dest('build/style/global/'));
     
     cb();
  });

//   Delete

gulp.task('del', function del(cb) {
   rimraf('build', cb);
});

// Copy fonts
gulp.task('copy_fonts',function(){
    return gulp.src('./source/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts'));
   
});

// Copy img
gulp.task('copy_img',function(){
    return gulp.src('/source/img/**/*.*')
    .pipe(gulp.dest('build/img'));
   
});
// rename to a fixed value
gulp.task('rename',function(){
    gulp.src("build/css/main.css")
  .pipe(rename("build/css/main.min.css"))
  .pipe(gulp.dest("build/"));
});
// Parallel tasks
gulp.task('copy', gulp.parallel('copy_fonts','copy_img'));

// Watch
gulp.task('watch',function(){
    gulp.watch('source/styles/**/*.scss').on('change',series('styles_compile'));
    gulp.watch('source/templates/**/*.pug').on('change',series('templates_compile'));
});

// Default
gulp.task('default', gulp.series(
    'del',
    gulp.parallel('templates_compile','styles_compile','copy','sprite'),
    gulp.parallel('watch','server'),
    "rename" ,
));