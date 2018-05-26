$(function() {
    const socket = io.connect('http://127.0.0.1:3000/', { 'transports': ['websocket'] });

    socket.on('connect', () => {
        socket.emit('room', localStorage.nickname);
        socket.emit('get dialog list');
    });

    let show_alert = true;
    socket.on("connect_error", () => {
        if (show_alert) {
            swal("Server is not responding!", "It is not your fault. We are working on it...", "error", {
                    buttons: {
                        stop: {
                            text: "Don't show it again",
                            value: "stop",
                        },
                        ok: true,
                    },
                })
                .then((value) => {
                    switch (value) {
                        case "stop":
                            show_alert = false;
                            swal.close();
                            break;
                        default:
                            swal.close();
                    }
                });
        }
    });

    const $messages = $('.messages');
    const $find = $('#find');


    find_btn_animation();
    create_user_profile();
    $(window).resize(() => $('.last_message').css('max-width', $('.list_users').width() / 1.3));
    $find.keyup(find_user);
    $('.list_users').on("click", ".user_block", show_dialog);
    $('#send_btn').click(send_message);
    $('#sing_out').click(exit);
    $('#msg_to_send').keyup((event) => {
        if (!event.ctrlKey && event.which == 13) {
            event.preventDefault();
            if ($('#msg_to_send').val().length > 1) {
                send_message();
                $('#msg_to_send').val('');
            }
            return;
        }
        if (event.ctrlKey) {
            caretStart = $('#msg_to_send')[0].selectionStart;
            caretEnd = $('#msg_to_send')[0].selectionEnd;
            $('#msg_to_send').val($('#msg_to_send').val().substring(0, caretStart) +
                "\n" +
                $('#msg_to_send').val().substring(caretEnd));
            $("#msg_to_send").css('height', '+=20');
            if ($("#msg_to_send").css('height') != '140px') $("#msg_to_send").css('margin-top', '-=20');
        }
    });


    function find_user() {
        if (!($find.val())) {
            show_user_blocks();
            hide_finded_users();
        } else {
            hide_user_blocks();
            hide_finded_users();
            socket.emit('find user', $find.val());
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
        $('.center_list').css({ 'background-image': '' });
        $('.d-inline-block').css('color', '#666');
        $('.user_nickname').css('color', '#000');
        $(this).find('.p-2.badge').hide();
        $(this).find('.d-inline-block').css('color', '#fff');
        $(this).find('.user_nickname').css('color', '#fff');

        $('.header_panel').show();
        $('#send_block').show();
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


    function add_msg_from_db(msg) {
        let text = msg['text'];
        let time = msg_time_converter(msg['time']);
        if (msg['author'] == localStorage.nickname) {
            $messages.append($('<div class="answer right" />')
                .append($('<div class="text" />').html(text))
                .append($('<div class="time" />').html(time)));
        } else {
            $messages.append($('<div class="answer left" />')
                .append($('<div class="text" />').html(text))
                .append($('<div class="time" />').html(time)));
        }
    }


    function send_message() {
        let from = localStorage.nickname;
        let to = localStorage.to;
        let text = $('#msg_to_send').val().trim();
        $('#msg_to_send').val('');
        $("#msg_to_send").css('height', '40');
        socket.emit('send message to', from, to, text);
        let time = msg_time_converter(Date.now());
        // $("div.scroll.messages").scrollTop(2200);
        $messages
            .append($('<div class="answer right"></div>')
                .append($('<div class="text"></div>').html(text))
                .append($('<div class="time"></div>').html(time)));
    }


    function create_user_profile() {
        socket.emit('get my info');
        if (localStorage.nickname) {
            let nick = localStorage.nickname.toUpperCase();
            $(".my_photo").text(nick.charAt(0) + nick.charAt(1));
            $('#modal_my_nickname').html(localStorage.nickname);
        }
    }


    function exit() {
        localStorage.clear();
        document.location.href = "registration.html";
    }


    function find_btn_animation() {
        if ($(window).width() >= 768) {
            $find.bind('focus', function() {
                $('#button_settings').toggle(150);
                $('.search_input').css({
                    'margin-left': '10px'
                });
            });
            $find.bind('blur', function() {
                $('#button_settings').toggle(150);
                $('.search_input').css({
                    'margin-left': '0px'
                });
            });
        } else {
            $find.bind('focus', function() {
                $('#button_settings').toggle(150);
                $('.but_set_menu').toggle(150);
                $('.search_input').css({
                    "margin-left": "10px",
                    "margin-right": "10px"
                });
            });
            $find.bind('blur', function() {
                $('.but_set_menu').toggle(150);
                $('#button_settings').toggle(150);
                $('.search_input').css({
                    "margin-left": "0px",
                    "margin-right": "0px"
                });
            });
        }
    }

    function clean_msg() {
        $messages.empty();
    }


    socket.on('get message', (text, from, timestamp) => {
        let time = msg_time_converter(timestamp);
        if (from !== localStorage.nickname) {
            $messages.append($('<div class="answer left" />')
                .append($('<div class="text" />').html(text))
                .append($('<div class="time" />').html(time)));
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
        $('#user_nickname').html(nickname);

        if (online) {
            $('.user_info_lasttime').html('online');
        } else {
            $('.user_info_lasttime').timeago('update', new Date(time));
        }
    });


    socket.on('put my info', (email) => {
        $('#modal_my_mail').html(email);
    });


    socket.on('put user messages', (messages) => {
        clean_msg();
        messages.forEach((msg) => {
            add_msg_from_db(msg);
        });
    });


    socket.on('put dialog list', (dialog_list) => {
        dialog_list.forEach((nickname) => {
            add_dialog(nickname);
        });
    });

});


function format_time(time) {
    if (time.length == 1) return time = '0' + time;
    return time;
}

function msg_time_converter(UNIX_timestamp) {
    let a = new Date(UNIX_timestamp);
    let hour = format_time(a.getHours().toString());
    let min = format_time(a.getMinutes().toString());
    return hour + ':' + min;
}