var pkg = require('./package.json');
var gulp = require('gulp');
var concat = require('gulp-concat');
var minifycss = require('gulp-minify-css');
var uglifyjs = require('gulp-uglify');

gulp.task('css', function () {
    return gulp.src(['src/css/*.css'])
        .pipe(minifycss())
        .pipe(concat( pkg.name + '.css' ))
        .pipe(gulp.dest('build'));
});

gulp.task('scripts', function () {
    return gulp.src(['src/js/*.js'])
        .pipe(uglifyjs())
        .pipe(concat( pkg.name  + '.min.js' ))
        .pipe(gulp.dest('build'));
});

gulp.task('dev', function () {
    gulp.watch(['src/js/*.js'], ['scripts']);
    gulp.watch(['src/css/*.css'], ['css']);
});

gulp.task('prod', ['css', 'scripts']);

gulp.task('default', ['prod']);