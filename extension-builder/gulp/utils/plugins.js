var plugins = {
    replace: require('gulp-replace'),
    rename: require('gulp-rename'),
    concat: require('gulp-concat'),
    clean: require('gulp-clean'),
    shell: require('gulp-shell'),
    fs: require('fs'),
    fsEx: require('fs-extra'),
    runSequence: require('run-sequence'),
    childProcess: require('child_process'),
    mocha: require('gulp-mocha'),
    webpack: require("webpack"),
    util: require("gulp-util"),
    less: require('gulp-less')
};

plugins.exec = require('./exec')(plugins);

module.exports = plugins;
