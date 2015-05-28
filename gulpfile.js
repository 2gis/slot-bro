var gulp = require('gulp');
var requireDir = require('require-dir');
requireDir('./gulp-tasks');
require('./extension-builder/gulpfile');

gulp.task('build', ['hooks', 'extension.build'/*, 'watch'*/]);
gulp.task('default', function(cb) {
    /*eslint-disable no-undef, no-console */
    console.log('Usage: ');
    console.log('  gulp\t\t Output this help.');
    console.log('  gulp build\t Build extension folders for debug purposes, no packages produced.');
    console.log('Parameters:');
    console.log('  --pack\t Build extension packages for debug purposes, certificates are required to build chrome & safari packages.');
    console.log('  --release\t Same as above, but with release flag turned on (so no debug messages are emitted, etc).');
    console.log('  --watch\t Watch file changes ad rebuild resources when required.');
    console.log('\nSee README.md for further instructions.');
    /*eslint-enable no-undef, no-console */
    cb();
});
