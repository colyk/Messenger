$(function() {

    var socket = io.connect('http://127.0.0.1:3000/', { 'transports': ['websocket'] });

    $('#log_in').submit(send_login_form);
    $('#sign_up').submit(send_signup_form);

    // Если пользователь заходил, то войти автоматически
    // if(localStorage.nickname){document.location.href = "index.html";}
    function send_login_form() {
        event.preventDefault();
        let nickname = $('#nickname').val();
        let pass = $('#password').val();
        socket.emit('log in', nickname, pass);
    }

    function send_signup_form() {
        event.preventDefault();
        let nickname = $('#nickname_s').val();
        let pass = $('#password_s').val();
        let email = $('#email').val();
        socket.emit('sign up', nickname, pass, email);
    }

    socket.on('render user page', (nickname, password) => {
        console.log('User accepted');

        localStorage.nickname = nickname;
        localStorage.password = password;
        
        document.location.href = "index.html";
    });

    socket.on('signup user existed', () => {
        console.log('User didnt accept');
    });
    socket.on('log in error', () => {
        console.log('Логин либо пароль не верен');
    });


});