var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var redis = require('redis');
var client = redis.createClient();

app.use(express.static(__dirname + '/node_modules'));  

app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/templates/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log('message: ' + msg);
  });
});

server.listen(5000);