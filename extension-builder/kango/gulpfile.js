var fs = require('fs');
var gulp = require('gulp');
var _ = require('lodash');

var pathRegex = /--path=(.*)/;
var matches, outputPath;
for (var i in process.argv) {
    if (matches = process.argv[i].match(pathRegex)) {
        outputPath = matches[1];
        break;
    }
}

if (!outputPath) {
    console.error('You should set output path by adding --path=PATH to gulp call');
    process.exit();
}

var dirs = {
    chrome: [
        './src/js/chrome safari ie/',
        './src/js/chrome safari/',
        './src/js/chrome/',
        './src/js/common/',
        './src/patches/common/',
        './src/patches/chrome/'
    ],
    safari: [
        './src/js/chrome safari ie/',
        './src/js/chrome safari/',
        './src/js/firefox safari/',
        './src/js/safari/',
        './src/js/common/',
        './src/patches/common/',
        './src/patches/safari/'
    ],
    firefox: [
        './src/js/ie firefox/',
        './src/js/firefox safari/',
        './src/js/firefox/',
        './src/js/common/',
        './src/patches/common/',
        './src/patches/firefox/'
    ]
};

function wrapContentFile(fileSource) {
    return '"use strict";\n(function() {\nvar exports = {};\n%s\n})();'.replace('%s', fileSource);
}

function wrapFrameworkFile(name, fileSource) {
    return '"use strict";\n_kangoLoader.add("%file", function(require, exports, module) {\n%source\n});'
        .replace('%file', name)
        .replace('%source', fileSource);
}

function unwrapFrameworkFile(fileSource) { // wat, lol :) so workaround, much nonsense, wow
    return fileSource
        .split('\n')
        .join('!!')
        .replace(/"use strict";!!_kangoLoader\.add\("(.*?)", function\(require, exports, module\) \{!!(.*?)!!\}\);/, '$2')
        .split('!!')
        .join('\n');
}

function setWrapper(browser, folder, filename) {
    return function (source) {
        if (browser == 'firefox') return source; // firefox has native requires
        if (filename.split('.').pop() != 'js') return source; // don't wrap non-js files
        if (_.contains(['loader.js', 'bootstrap.js', 'global.js', 'kango_api.js', 'initialize.js', 'json2.js'], filename)) {
            return source; // some files do not need to be wrapped
        }
        var basedir = _.compact(folder.split('/')).pop();

        if (basedir == 'includes' && filename == 'content_kango.js') { // fixme: workaround :/
            var preSource = '';
            // we need to include some of already built files into content.js
            [
                outputPath + '/' + browser + '/kango/utils.js',
                outputPath + '/' + browser + '/kango/message_target.js',
                outputPath + '/' + browser + '/kango/storage_sync.js',
                outputPath + '/' + browser + '/kango/invoke_async.js'
            ].forEach(function(path) {
                preSource += unwrapFrameworkFile(fs.readFileSync(path, {encoding: 'utf8'}));
            });

            // and this one too
            var postSource = fs.readFileSync('./src/js/chrome safari/includes/content_init.js', {encoding: 'utf8'});

            return wrapContentFile(preSource + source + postSource);
        }
        if (_.contains(['includes', 'kango', 'kango-ui'], basedir)/* || isModule*/) {
            var moduleNameParts = filename.split('.');
            moduleNameParts.pop();
            return wrapFrameworkFile(basedir + '/' + moduleNameParts.join('.'), source);
        }
    };
}

function writeMerged(arr, dest, codeWrapper) {
    var content = '';
    arr.forEach(function(path) {
        content += fs.readFileSync(path, {encoding: 'utf8'});
    });
    fs.writeFileSync(dest, codeWrapper(content));
}

function buildFrameworkFolder(browser, startFolder, destFolder) {
    var files = {};
    dirs[browser].forEach(function(path) {
        try {
            fs.readdirSync(path + startFolder).forEach(function (file) {
                var cleanName = file.replace('.part', '');
                if (!fs.statSync(path + startFolder + '/' + file).isDirectory()) {
                    if (files[cleanName]) {
                        files[cleanName].push(path + startFolder + '/' + file)
                    } else {
                        files[cleanName] = [path + startFolder + '/' + file];
                    }
                }
            });
        } catch (err) {}
    });

    for (var i in files) {
        files[i].sort(function(a, b) {
            if (a.indexOf('.part') === -1) {
                return -1;
            } else if (b.indexOf('.part') === -1) {
                return 1;
            } else {
                return 0;
            }
        });
        if (i == 'content_kango.js') { // fixme: workaround :/
            writeMerged(files[i], destFolder + '/content.js', setWrapper(browser, destFolder, i));
        } else {
            writeMerged(files[i], destFolder + '/' + i, setWrapper(browser, destFolder, i));
        }

    }
}

function makeDir(path) {
    try {
        fs.mkdirSync(path);
    } catch (err) {
        switch (err.code) {
            case 'ENOENT':
                throw new Error('Folder ' + outputPath + ' not exists');
                break;
            case 'EEXIST': // do nothing
                break;
            default:
                throw err;
        }
    }
}

function buildModule(browser, module) {
    return function(cb) {
        try {
            makeDir(outputPath + '/' + browser);
            makeDir(outputPath + '/' + browser + '/' + module);
            buildFrameworkFolder(browser, module, outputPath + '/' + browser + '/' + module);
            cb();
        } catch (err) {
            console.log('Something went wrong:');
            console.log(err);
        }
    };
}

gulp.task('build.framework.chrome', ['build.framework.chrome.includes', 'build.framework.chrome.kangoui']);
gulp.task('build.framework.chrome.kango', buildModule('chrome', 'kango'));
gulp.task('build.framework.chrome.kangoui', buildModule('chrome', 'kango-ui'));
gulp.task('build.framework.chrome.includes', ['build.framework.chrome.kango'], buildModule('chrome', 'includes'));

gulp.task('build.framework.firefox', ['build.framework.firefox.kango', 'build.framework.firefox.kangoui', 'build.framework.firefox.kangouiTheme', 'build.framework.firefox.bootstrap']);
gulp.task('build.framework.firefox.kango', buildModule('firefox', 'kango'));
gulp.task('build.framework.firefox.kangoui', buildModule('firefox', 'kango-ui'));
gulp.task('build.framework.firefox.kangouiThemeFolder', buildModule('firefox', 'kango-ui/theme'));
gulp.task('build.framework.firefox.kangouiTheme', ['build.framework.firefox.kangouiThemeFolder'], buildModule('firefox', 'kango-ui/theme/bubble'));
gulp.task('build.framework.firefox.bootstrap', function() {
    return gulp.src('./src/js/firefox/bootstrap.js')
        .pipe(gulp.dest(outputPath + '/firefox'));
});

gulp.task('build.framework.safari', ['build.framework.safari.includes', 'build.framework.safari.kangoui']);
gulp.task('build.framework.safari.kango', buildModule('safari', 'kango'));
gulp.task('build.framework.safari.kangoui', buildModule('safari', 'kango-ui'));
gulp.task('build.framework.safari.includes', ['build.framework.safari.kango'], buildModule('safari', 'includes'));

gulp.task('default', [
    'build.framework.chrome',
    'build.framework.firefox',
    'build.framework.safari'
]);
