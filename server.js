var express = require('express');
var app = express();

var port = 2000;

app.use(express.static(__dirname));
app.use('/', function(req, res){
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    req.pipe(res);
});

app.listen(port, function() {
    console.log('server start on port', port);
});
