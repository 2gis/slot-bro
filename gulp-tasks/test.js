require('babel/register'); // for tests in es6

var gulp = require('gulp');
var mocha = require('gulp-mocha');

var tests = [
    '**/*.unit.js'
];

gulp.task('tests.run', function() {
    return gulp.src(tests, {read: false})
        .pipe(mocha({
            globals: ['DEBUG'],
            reporter: 'nyan'
        }));
});