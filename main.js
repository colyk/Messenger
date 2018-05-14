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


    socket.on('log in', (nickname, pass) => {
        console.log("Login data:", nickname, pass);
        redisClient.hexists('users', nickname, function(err, reply) {
            if (reply) {
                redisClient.hget("users", nickname, function(err, reply) {
                    if (pass === reply.split(',')[0].split(':')[1]) {
                        socket.emit('render user page', nickname, pass);
                        socket.nickname = nickname;
                    } else {
                        socket.emit('log in error');
                    }
                });
            } else {
                socket.emit('log in error');
            }
        });
    });


    socket.on('sign up', (nickname, pass, email) => {
        console.log("Signup data: ", nickname, pass, email);
        user_info = {
            'pass': pass,
            'email': email
        };
        redisClient.hexists('users', nickname, function(err, reply) {
            if (reply) {
                socket.emit('signup user existed', nickname, pass);

            } else {
                redisClient.hset("users", nickname, JSON.stringify(user_info));
                socket.emit('render user page', nickname, pass);
            }
        });
    });

    socket.on('find user', (nickname) => {
        redisClient.hexists('users', nickname, function(err, reply) {
            if (reply) {
                socket.emit('finded user', nickname);

            } else {
                socket.emit('user doesnt exist', nickname);
            }
        });
    });



});



server.listen(port, () => {
    console.log('Server listening at port %d', port);
});