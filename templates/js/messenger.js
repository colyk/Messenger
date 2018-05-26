// TODO: random colors for user logo
$(function() {
    const socket = io.connect('http://127.0.0.1:3000/', { 'transports': ['websocket'] });

    socket.on('connect', () => {
        socket.emit('room', localStorage.nickname);
        socket.emit('get dialog list');
    });

    socket.on("connect_error", () => connect_error_alert());

    const $messages = $('.messages');
    const $find = $('#find');


    find_btn_animation();
    create_user_profile();
    $(window).resize(() => $('.last_message').css('max-width', $('.list_users').width() / 1.3));
    $find.keyup(find_user);
    $('.list_users').on("click", ".user_block", show_dialog);
    $('#send_btn').click(send_message);
    $('#sing_out').click(exit);
    $(document).keyup((e) => hide_messages_body(e));
    $('#msg_to_send').keypress((e) => send_message_enter(e));


    function send_message_enter(event) {
        if (!event.ctrlKey && event.which == 13) {
            event.preventDefault();
            if ($('#msg_to_send').val().length > 0) {
                send_message();
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
    }


    function hide_messages_body(event) {
        if (event.keyCode == 27) {
            $('.center_list').css({ 'background-image': 'url("https://webfon.top/wp-content/uploads/2016/10/4.jpg"', 'background-size': 'auto' });
            $('.header_panel').hide();
            $('#send_block').hide();
            clean_msg();
            $('.greeting').show();
        }
    }


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


    function add_finded_user(nick, last_msg, msg_count, time) {
        let logo = nick.charAt(0).toUpperCase() + nick.charAt(1).toUpperCase();
        $('<li class="list-group-item d-flex flex-row user_block finded" ></li>')
            .append($('<div class="user_photo"></div>').text(logo))
            .append($('<div></div>')
                .append($('<div class="user_nickname"></div>').text(nick),
                    $('<div class="d-inline-block text-truncate" class="last_message"></div>').text(last_msg)))

            .append($('<div class="p-2 ml-auto text-center" />')
                .append($('<div class="last_msg_time" />').text(time),
                    $('<div class="msg_count badge badge-primary badge-pill" />').text(msg_count)))
            .appendTo('.list_users');
    }


    function add_dialog(nick) {
        socket.emit('get last message', nick);
        socket.emit('get messages count', nick);
        let logo = nick.charAt(0).toUpperCase() + nick.charAt(1).toUpperCase();
        $('<li class="list-group-item d-flex flex-row user_block dialog" />').attr('id', nick + '_nick')
            .append($('<div class="user_photo" />').text(logo))
            .append($('<div />')
                .append($('<div class="user_nickname" />').text(nick),
                    $('<div class="d-inline-block text-truncate last_message" />').text('default_last_msg')))

            .append($('<div class="p-2 ml-auto text-center" />')
                .append($('<div class="last_msg_time" />').text('10:15'),
                    $('<div class="msg_count badge badge-primary badge-pill" />').text(0)))
            .appendTo('.list_users');
    }


    function show_dialog() {
        $('.center_list').css({ 'background-image': '' });
        $('.d-inline-block').css('color', '#666');
        $('.user_nickname').css('color', '#000');
        $('.last_msg_time').css('color', '#333');
        //clickActiveBut();//треба функцію тут визвати
        $(this).find('.msg_count').hide();

        $(this).find('.d-inline-block').css('color', '#fff');
        $(this).find('.user_nickname').css('color', '#fff');
        $(this).find('.last_msg_time').css('color', '#fff');

        $('.header_panel').show();
        $('#send_block').show();
        show_user_info($(this).find('.user_nickname').html());
        $('.list_users').find('.user_block').removeClass('clicked');;
        $(this).addClass('clicked');
        localStorage.to = $(this).find('.user_nickname').html();
        show_user_msg();
        search_input_style();
    }


    function search_input_style() {
        if ($(window).width() < 768) {
            $('.but_set_menu').css({ 'display': 'block' });
            $('.search_input').css({ 'margin-right': '0px' });
        }
        $(window).resize(() => {
            if ($(window).width() >= 768) {
                $('.but_set_menu').css({ 'display': 'none' });
                $('.search_input').css({ 'margin-right': '10px' });
            }
            if ($(window).width() < 768) {
                $('.but_set_menu').css({ 'display': 'block' });
                $('.search_input').css({ 'margin-right': '0px' });
            }
        });
    }


    function show_user_info(nickname) {
        socket.emit('get user info', nickname);
    }


    function show_user_msg() {
        socket.emit('get user messages', localStorage.nickname, localStorage.to);
        $('.greeting').hide();
    }


    function add_msg_from_db(msg) {
        let text = msg['text'];
        let time = msg_time_converter(msg['time']);
        if (msg['author'] == localStorage.nickname) {
            $messages.append($('<div class="answer right" />')
                .append($('<div class="text" />').text(text))
                .append($('<div class="time" />').text(time)));
        } else {
            $messages.append($('<div class="answer left" />')
                .append($('<div class="text" />').text(text))
                .append($('<div class="time" />').text(time)));
        }
    }


    function send_message() {
        let from = localStorage.nickname;
        let to = localStorage.to;
        let text = $('#msg_to_send').val().trim();
        socket.emit('send message to', from, to, text);
        
        $('#msg_to_send').val('');
        $("#msg_to_send").css('height', '40');
        let time = msg_time_converter(Date.now());
        $messages
            .append($('<div class="answer right"></div>')
                .append($('<div class="text"></div>').text(text))
                .append($('<div class="time"></div>').text(time)));

        $(".scroll").scrollTop($('.scroll').prop('scrollHeight') + $('.scroll').height());
    }


    function create_user_profile() {
        socket.emit('get my info');
        if (localStorage.nickname) {
            let nick = localStorage.nickname.toUpperCase();
            $(".my_photo").text(nick.charAt(0) + nick.charAt(1));
            $('#modal_my_nickname').text(localStorage.nickname);
        }
    }


    function exit() {
        localStorage.clear();
        document.location.href = "registration.html";
    }


    function find_btn_animation() {
        if ($(window).width() >= 768) {
            $find.bind('focus', function() {
                if ($('.but_set_menu').css('display') == 'block') $('.but_set_menu').toggle(150);
                $('#button_settings').toggle(150);
                $('.search_input').css({
                    'margin-left': '10px',
                    'margin-right': '10px'
                });
            });
            $find.bind('blur', function() {
                if ($('.but_set_menu').css('display') == 'none' && $(".clicked").length != 0 && $(window).width() < 768) {
                    $('.but_set_menu').toggle(150);
                    $('.search_input').css({
                        "margin-left": "0px",
                        "margin-right": "0px"
                    });
                } else
                    $('.search_input').css({
                        "margin-left": "0px",
                        "margin-right": "10px"
                    });
                $('#button_settings').toggle(150);
            });
        } else {
            $find.bind('focus', function() {
                if ($('.but_set_menu').css('display') == 'block') $('.but_set_menu').toggle(150);
                $('#button_settings').toggle(150);
                $('.search_input').css({
                    "margin-left": "10px",
                    "margin-right": "10px"
                });
            });
            $find.bind('blur', function() {
                if ($('.but_set_menu').css('display') == 'none' && $(".clicked").length != 0 && $(window).width() < 768) {
                    $('.but_set_menu').toggle(150);
                    $('.search_input').css({
                        "margin-left": "0px",
                        "margin-right": "0px"
                    });
                } else
                    $('.search_input').css({
                        "margin-left": "0px",
                        "margin-right": "10px"
                    });
                $('#button_settings').toggle(150);
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
                .append($('<div class="text" />').text(text))
                .append($('<div class="time" />').text(time)));
        }
    });


    socket.on('finded user', (nickname) => {
        console.info('User ' + nickname + ' exist');
        add_finded_user(nickname, 'last_msg', '11', 'time');
    });


    socket.on('user doesnt exist', (nickname) => {
        console.info('User ' + nickname + ' doesnt exist');
    });


    socket.on('put user info', (nickname, online, time) => {
        $('#user_nickname').text(nickname);

        if (online) {
            $('.user_info_lasttime').text('online');
        } else {
            $('.user_info_lasttime').timeago('update', new Date(time));
        }
    });


    socket.on('put my info', (email) => {
        $('#modal_my_mail').text(email);
    });


    socket.on('put user messages', (messages) => {
        clean_msg();
        messages.forEach((msg) => add_msg_from_db(msg));
        $(".scroll").scrollTop($('.scroll').prop('scrollHeight') - $('.scroll').height());
    });


    socket.on('put dialog list', (dialog_list) => {
        dialog_list.forEach((nickname) => {
            add_dialog(nickname);
        });
    });


    socket.on('put last message', (to, author, text, time) => {
        let dialog = $('#' + to + '_nick');
        dialog.find('.last_msg_time').text(last_msg_time_converter(time));
        if (localStorage.nickname == author) {
            dialog.find('.last_message').text('You: ' + text);

        } else {
            dialog.find('.last_message').text(text);
        }

    });

});

let show_alert = true;


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


function last_msg_time_converter(UNIX_timestamp) {
    let msg_time = new Date(UNIX_timestamp);
    let now = new Date();

    let msg_year = msg_time.getFullYear();
    let msg_month = msg_time.getMonth();
    let msg_date = msg_time.getDate();

    let now_month = now.getMonth();
    let now_date = now.getDate();

    if (now_date == msg_date && now_month == msg_month) {
        let hour = format_time(msg_time.getHours().toString());
        let min = format_time(msg_time.getMinutes().toString());
        return hour + ':' + min + '';
    } else {
        return msg_date + '.' + format_time((msg_month + 1).toString()) + '.' + msg_year.toString().slice(-2);
    }
}


function connect_error_alert() {
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
}