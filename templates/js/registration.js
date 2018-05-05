$(function() {

    var socket = io.connect('http://127.0.0.1:3000/', { 'transports': ['websocket'] });

    $('#reg').submit(function() {
        let nickname = $('#nickname').val();
        let pass = $('#password').val();
        let email = $('#email').val();
        console.log(nickname, pass, email);
        socket.emit('log in', nickname, pass, email);
    })



});