var _ = require('lodash');
var gulp = require('gulp');
var eslint = require('gulp-eslint');

var files = [
    '**/*.js',
    '!**/node_modules/**/*',
    '!coverage/**/*.js',
    '!gulp-tasks/**/*.js'
];

gulp.task('lint', function() {
    return gulp.src(files)
        // eslint() attaches the lint output to the eslint property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failOnError last.
        .pipe(eslint.failOnError());
});
