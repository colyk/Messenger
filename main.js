var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');
var redis = require('redis');
var redisClient = redis.createClient({ host: 'localhost', port: 6379 });

io.set('transports', ['websocket']);
var port = process.env.PORT || 3000;

redisClient.on("connect", () => console.log('Redis server connected'));
redisClient.on("error", (err) => console.log("Error " + err));

io.on('connection', (socket) => {

    socket.on('log in', (nickname, pass) => {
        console.log("Login data:", nickname, pass);
        redisClient.hexists('users', nickname, function(err, reply) {
            if (reply) {
                redisClient.hget("users", nickname, function(err, reply) {
                    if (pass === JSON.parse(reply)['pass']) {
                        socket.emit('render user page', nickname, pass);
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
        const user_info = {
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


    socket.on('room', (nickname) => {
        console.log('Joined ' + nickname);
        const user_info = {
            'online': true,
            'time': Date.now()
        };
        socket.join(nickname);
        redisClient.hset("last_seen", nickname, JSON.stringify(user_info));
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


    // Отправка смс в чате: socket.broadcast.to(‘roomName’).emit()
    socket.on('send message to', (from, to, text) => {
        let tmp = [];
        tmp.push(to, from);
        tmp.sort();
        let dialog = tmp[0] + '_' + tmp[1];
        const messages = { 'messages': [] };
        const message = {
            'author': from,
            'text': text,
            'time': Date.now()
        };

        redisClient.hget("messages", dialog, (err, reply) => {
            if (reply) {
                messages['messages'] = JSON.parse(reply)['messages'];
                messages['messages'].push(message);
            } else {
            	redisClient.sadd(from, to);
                messages['messages'].push(message);
            }
            redisClient.hset("messages", dialog, JSON.stringify(messages));
        });

        io.to(to).emit('get message', text, from);
    });


    socket.on('get user messages', (from, to) => {
        let tmp = [];
        tmp.push(to, from);
        tmp.sort();
        let dialog = tmp[0] + '_' + tmp[1];

        redisClient.hget("messages", dialog, (err, reply) =>{
            if (reply) {
                io.to(from).emit('put user messages', JSON.parse(reply)['messages']);
            } else {
                io.to(from).emit('put user messages', []);
            }
        });
    });


    socket.on('get user info', (nickname) => {
        redisClient.hexists('last_seen', nickname, (err, reply) => {
            if (reply) {
                redisClient.hget("last_seen", nickname, (err, reply) => {
                    let online = JSON.parse(reply)['online'];
                    let time = JSON.parse(reply)['time'];
                    socket.emit('put user info', nickname, online, time);
                });
            } else {
                console.log('get user info error');
            }
        });
    });


    socket.on('get my info', () => {
        let nickname = Object.keys(socket.rooms)[1];
        redisClient.hexists('users', nickname, function(err, reply) {
            if (reply) {
                redisClient.hget("users", nickname, function(err, reply) {
                    socket.emit('put my info', JSON.parse(reply)['email']);
                });
            } else {
                console.log('get my info error.');
            }
        });
    });


    socket.on('get dialog list', () => {
        let nickname = Object.keys(socket.rooms)[1];
        redisClient.smembers(nickname, (err, replies) => {
            if (!err) {
                socket.emit('put dialog list', replies);
            } else {
                socket.emit('put dialog list', []);
            }
        })
    });


    socket.on('disconnecting', () => {
        let nickname = Object.keys(socket.rooms)[1];
        const user_info = {
            'online': false,
            'time': Date.now()
        };
        redisClient.hset("last_seen", nickname, JSON.stringify(user_info));
    });


});



server.listen(port, () => {
    console.log('Server listening at port %d', port);
});