var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');
var redis = require('redis');
var redisClient = redis.createClient({ host: 'localhost', port: 6379 });

io.set('transports', ['websocket']);
var port = process.env.PORT || 3000;


io.on('connection', (socket) => {
    console.log('User with id ' + socket.id + ' conected');
    socket.on('log in', (nickname, pass, email) => {
        console.log(nickname, pass, email);
    });


});

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});