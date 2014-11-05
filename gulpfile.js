var concat = require('gulp-concat');
var gulp = require('gulp');
var glob = require('glob');
var path = require('path');
var browserify  = require('browserify');
var source = require('vinyl-source-stream');
var rename = require('gulp-rename');
var exorcist = require('exorcist');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

gulp.task('package', ['package-require', 'package-require-min']);

gulp.task('package-require', function(callback){
    var b = browserify({
        debug: true,
        paths: ['../']
    });

    gulp.src('./node_modules/awayjs-**/build/*.d.ts')
        .pipe(concat('awayjs-dist-require.d.ts'))
        .pipe(gulp.dest('./build'));

    glob('./node_modules/awayjs-**/lib/**/*.js', {}, function (error, files) {

        files.forEach(function (file) {
            b.require(file, {expose:path.relative('../', file.slice(0,-3))});
        });

        b.bundle()
            .pipe(exorcist('./build/awayjs-dist-require.js.map'))
            .pipe(source('awayjs-dist-require.js'))
            .pipe(gulp.dest('./build'))
            .on('end', callback);
    });
});

gulp.task('package-require-min', ['package-require'], function(callback){
   return gulp.src('./build/awayjs-dist-require.js')
       .pipe(sourcemaps.init({loadMaps:true}))
       .pipe(uglify({compress:false}))
       .pipe(rename(function (path) {
           path.basename += '.min';
       }))
       .pipe(sourcemaps.write('./'))
       .pipe(gulp.dest('./build'));
});