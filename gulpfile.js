var gulp = require('gulp');
var less = require('gulp-less');
var handlebars = require('handlebars');
var gulpHandlebars = require('gulp-handlebars-html')(handlebars);
var rename = require('gulp-rename');

//TODO: to be fixed
gulp.task('minify', function() {
  gulp.src('public/javascripts/*.js')
    .pipe(minify())
    .pipe(gulp.dest('build/javascripts/*.js'))
});

gulp.task('js', function() {
  return gulp.src('public/javascripts/**/*.js')
    .pipe(gulp.dest('build/javascripts'));
});

gulp.task('css', function() {
   gulp.src('public/stylesheets/style.less')
      .pipe(less())
      .pipe(gulp.dest('build/stylesheets'))
});

gulp.task('images', function() {
  return gulp.src('public/images/*')
    .pipe(gulp.dest('build/images'));
});

gulp.task('assets', function() {
  return gulp.src('public/assets/*')
    .pipe(gulp.dest('build/assets'));
});


//This is not done yet. 
//TODO: write job to compile template
gulp.task('html', function () {
    var templateData = {
        title: 'earth.audio'
    },
    options = {
        partialsDirectory : ['views']
    }
    return gulp.src('views/layout.hbs')
        .pipe(gulpHandlebars(templateData))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('build'));
});

gulp.task('build', ['js', 'css', 'images', 'assets']);