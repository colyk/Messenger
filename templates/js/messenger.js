$(function() {
    const socket = io.connect('http://127.0.0.1:3000/', { 'transports': ['websocket'] });

    socket.on('connect', function() {
        socket.emit('room', localStorage.nickname);
        socket.emit('get dialog list');
    });

    create_user_profile();
    $(window).resize(() => $('.last_message').css('max-width', $('.list_users').width() / 1.3));
    $('#find').keyup(find_user);
    $('.list_users').on("click", ".user_block", show_dialog);
    $('#send_btn').click(send_message);
    $('#sing_out').click(exit);
    $('#find').focus(() => $('#button_settings').toggle(150));
    $('#find').blur(() => $('#button_settings').toggle(150));
    $('#msg_to_send').keyup((event) => {
        if (event.which == 13) {
            event.preventDefault();
            if ($('#msg_to_send').val().length > 1) {
                send_message();
                $('#msg_to_send').val('');
            }
        }
        if (event.ctrlKey) {
            $("#msg_to_send").val(function(i, val) {
                return val + "\n";
            });
            $("#msg_to_send").css('height', '+=20');
        }
    });


    function find_user() {
        if (!($('#find').val())) {
            show_user_blocks();
            hide_finded_users();
        } else {
            hide_user_blocks();
            hide_finded_users();
            socket.emit('find user', $('#find').val());
        }
    }


    function hide_user_blocks() {
        $('.list_users').find('.dialog').removeClass('d-flex flex-row').hide();
    }


    function hide_finded_users() {
        $('.list_users').find('.finded').removeClass('d-flex flex-row').hide();
    }


    function show_user_blocks() {
        $('.list_users').find('.dialog').addClass('d-flex flex-row').show();

    }


    function add_finded_user(nick, last_msg, msg_count) {
        let logo = nick.charAt(0).toUpperCase() + nick.charAt(1).toUpperCase();
        $('<li class="list-group-item d-flex flex-row user_block finded" ></li>')
            .append($('<div class="user_photo"></div>').html(logo))
            .append($('<div></div>')
                .append($('<div class="user_nickname"></div>').html(nick),
                    $('<div class="d-inline-block text-truncate" class="last_message"></div>').html(last_msg)))
            .append($('<div class="ml-auto p-2 badge badge-primary badge-pill "></div>').html(msg_count))
            .appendTo('.list_users');
    }


    function add_dialog(nick) {
        let logo = nick.charAt(0).toUpperCase() + nick.charAt(1).toUpperCase();
        $('<li class="list-group-item d-flex flex-row user_block dialog" ></li>')
            .append($('<div class="user_photo"></div>').html(logo))
            .append($('<div></div>')
                .append($('<div class="user_nickname"></div>').html(nick),
                    $('<div class="d-inline-block text-truncate" class="last_message"></div>').html('last_msg')))
            .append($('<div class="ml-auto p-2 badge badge-primary badge-pill "></div>').html(1))
            .appendTo('.list_users');
    }


    function show_dialog() {
        show_user_info($(this).find('.user_nickname').html());
        $('.list_users').find('.user_block').removeClass('clicked');;
        $(this).addClass('clicked');
        localStorage.to = $(this).find('.user_nickname').html();
        show_user_msg();
    }


    function show_user_info(nickname) {
        socket.emit('get user info', nickname);
    }


    function show_user_msg() {
        socket.emit('get user messages', localStorage.nickname, localStorage.to);
    }


    function send_message() {
        let from = localStorage.nickname;
        let to = localStorage.to;
        let text = $('#msg_to_send').val().trim();
        $('#msg_to_send').val('');
        $("#msg_to_send").css('height', '40');
        socket.emit('send message to', from, to, text);
        $('.messages').append($('<p class="text-justify text-dark bg-light text_right msg"></p>').html(text))

    }


    function time_converter(UNIX_timestamp) {
        var a = new Date(UNIX_timestamp);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
        return time;
    }


    function msg_time_converter(UNIX_timestamp) {
        var a = new Date(UNIX_timestamp);
        var hour = a.getHours();
        var min = a.getMinutes();
        return hour + ':' + min;
    }


    function create_user_profile(argument) {
        socket.emit('get my info');
        if (localStorage.nickname) {
            let nick = localStorage.nickname.toUpperCase();
            $(".my_photo").text(nick.charAt(0) + nick.charAt(1));
            $('#modal_my_nickname').html(localStorage.nickname);
        }
    }

    function exit() {
        localStorage.remember = false;
        localStorage.nickname = '';
        localStorage.password = '';
        document.location.href = "registration.html";
    }

    socket.on('get message', (text, from) => {
        if (from !== localStorage.nickname) {
            $('.messages').append($('<p class="text-justify text-dark bg-light text_left msg"></p>').html(text))
            console.log('Incoming message:', text);
        }
    });


    socket.on('finded user', (nickname) => {
        console.info('User ' + nickname + ' exist');
        add_finded_user(nickname, 'last_msg', '11');
    });


    socket.on('user doesnt exist', (nickname) => {
        console.info('User ' + nickname + ' doesnt exist');
    });


    socket.on('put user info', (nickname, online, time) => {
        // console.log(nickname + '\n' + online + '\n' + time);
        if (online) {
            $('.user_info_lasttime').html('online');
        } else {
            $('.user_info_lasttime').html('last seen: ' + time_converter(time));
        }
        $('#user_nickname').html(nickname);
    });


    socket.on('put my info', (email) => {
        $('#modal_my_mail').html(email);
    });


    socket.on('put user messages', (messages) => {
        console.log(messages);
    });

    socket.on('put dialog list', (dialog_list) => {
        dialog_list.forEach((nickname) => {
            add_dialog(nickname);
        });
    });

});