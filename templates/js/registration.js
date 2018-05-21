$(function() {

    const socket = io.connect('http://127.0.0.1:3000/', { 'transports': ['websocket'] });

    $('#log_in').submit(send_login_form);
    $('#sign_up').submit(send_signup_form);
    $('#show_signup_form').click(show_signup_form);
    $('#show_login_form').click(show_login_form);
    $('#toggle_pass').click(togglePassword);


    if (localStorage.nickname ) {
        console.log(localStorage.remember);
        document.location.href = "index.html";
    }


    function send_login_form() {
        event.preventDefault();
        let nickname = $('#nickname').val();
        let pass = $('#password').val();
        localStorage.remember = $('#remember').prop('checked');
        socket.emit('log in', nickname, pass);
    }


    function send_signup_form() {
        event.preventDefault();
        let nickname = $('#nickname_s').val();
        let pass = $('#password_s').val();
        let email = $('#email').val();
        socket.emit('sign up', nickname, pass, email);
    }


    function show_signup_form() {
        $('#log_in').css('display', 'none');
        $('#sign_up').css('display', 'block');
    }


    function show_login_form() {
        $('#log_in').css('display', 'block');
        $('#sign_up').css('display', 'none');
    }


    function togglePassword() {
        if ($('#eye').hasClass('fa-eye')) {
            $('#password').attr('type', 'text');
            $('#eye').removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            $('#password').attr('type', 'password');
            $('#eye').removeClass('fa-eye-slash').addClass('fa-eye');
        }
    }


    socket.on('signup user existed', () => {
        $('#signup_error').html('User <b>' + $('#nickname_s').val() + '</b> already exist.').css('display', 'block');
        $('#nickname_s').val('');
    });


    socket.on('log in error', () => {
        $('#login_error').css('display', 'block');
        $('#nickname').val('');
        $('#password').val('');
    });


    socket.on('render user page', (nickname, password) => {
        console.log('User accepted');

        localStorage.nickname = nickname;
        localStorage.password = password;

        document.location.href = "index.html";
    });

});