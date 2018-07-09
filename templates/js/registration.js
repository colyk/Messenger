$(function() {
	
    if (localStorage.nickname && localStorage.password) {
        document.location.href = "index.html";
    }

    const socket = io.connect('http://127.0.0.1:3000/', { 'transports': ['websocket'] });

    $('#log_in').submit(sendLoginForm);
    $('#sign_up').submit(sendSignupForm);
    $('#show_signup_form').click(showSignupForm);
    $('#show_login_form').click(showLoginForm);
    $('#toggle_pass').click(togglePassword);


    function sendLoginForm() {
        event.preventDefault();
        let nickname = $('#nickname').val();
        let pass = $('#password').val();
        localStorage.remember = $('#remember').prop('checked');
        socket.emit('log in', nickname, pass);
    }


    function sendSignupForm() {
        event.preventDefault();
        let nickname = $('#nickname_s').val();
        let pass = $('#password_s').val();
        let email = $('#email').val();
        socket.emit('sign up', nickname, pass, email);
    }


    function showSignupForm() {
        $('#log_in').css('display', 'none');
        $('#sign_up').css('display', 'block');
    }


    function showLoginForm() {
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
        localStorage.nickname = nickname;
        localStorage.password = password;

        document.location.href = "index.html";
    });

});