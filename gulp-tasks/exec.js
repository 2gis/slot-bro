var childProcess = require('child_process');

module.exports = function(cmd, opts, cb) {
    var child = childProcess.exec(cmd, opts, function (err, stdout, stderr) {
        if (err) {
            var message = 'Child process failed ' + err + ':\n';
            if (!opts.verbose) {
                message += (stderr || stdout) + '\n';
            }
            cb(new Error(message));
        } else {
            cb(err, stdout);
        }
    });
    if (opts.verbose) {
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
    }
    return child;
};
