var express = require('express');
var http = require('http');
var app = express();

app.use(express.static(__dirname + (process.env.STATIC_DIR || '/build')));

var server = http.createServer(app);

server.listen(3000, function() {
  console.log('server running on port 3000');
});
