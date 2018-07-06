another_file_func();

let show_alert_error = true;
const user_photo_colors = ['#EDA86CFF', '#EE7AAEFF', '#65AADDFF', '#555555FF']
localStorage.backgroundImg = 'https://webfon.top/wp-content/uploads/2016/10/4.jpg';


$(function() {
    const socket = io.connect('http://127.0.0.1:3000/', { 'transports': ['websocket'] });
    socket.on('connect', () => {
        socket.emit('room', localStorage.nickname);
        socket.emit('get dialog list');
    });

    socket.on("connect_error", () => connect_error_alert());

    const $messages = $('.messages');
    const $find = $('#find');


    load_theme();
    create_user_profile();
    find_btn_animation();
    $find.keyup(find_user);
    $(window).resize(() => $('.last_message').css('max-width', $('.list_users').width() - 130));
    $(document).keyup((e) => { if (e.keyCode == 27) hide_messages_body() });
    $('#send_btn').click(send_message);
    $('#sing_out').click(exit);
    $('#delete_conversation').click(delete_conversation);
    $('#clear_history').click(clear_history);
    $('#user_info_show_but').click(set_user_data);
    $('.list_users').on("click", ".user_block", show_dialog);
    $('#msg_to_send').keypress((e) => send_message_enter(e));
    $('.img_picker').click(change_bg_image);
    $('#night_mode').change(() => { $('#night_mode').is(':checked') ? change_theme('dark.css') : change_theme('light.css') });


    function change_bg_image() {
        $('.img_picker').addClass('not_choosen');
        $(this).removeClass('not_choosen');
        let link = $(this).find('img').attr('src');
        // $('.scroll').css({ 'background-image': 'url(' + link + ')', 'background-size': 'auto' });
        // if (!$('.clicked').length) {
        //     $('.center_list').css({ 'background-image': 'url(' + link + ')', 'background-size': 'auto' });
        // }
        $('.center_list').css({ 'background-image': 'url(' + link + ')', 'background-size': 'auto' });
        $('#modal_cur_img').find('img').attr('src', link);
        localStorage.backgroundImg = link;
    }


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


    function sort_dialogs_by_time() {
        const $wrapper = $('ul.list_users');
        $wrapper.find('li').sort(function(a, b) {
                return b.dataset.sort - a.dataset.sort;
            })
            .appendTo($wrapper);
    }


    function hide_messages_body() {
        // TODO: remove clicked class
        $('.center_list').css({ 'background-image': 'url(' + localStorage.backgroundImg + ')', 'background-size': 'auto' });
        $('.header_panel').hide();
        $('#send_block').hide();
        clean_msg();
        $('.greeting').show();
    }


    function find_user() {
        if (!($find.val())) {
            show_user_blocks();
        } else {
            hide_user_blocks();
            socket.emit('find user', $find.val());
        }
        hide_finded_users();
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
        $('<li class="list-group-item d-flex flex-row user_block finded" />')
            .append($('<div class="user_photo" />').text(logo).css('background-color', get_bg_color(logo)))
            .append($('<div />')
                .append($('<div class="user_nickname" />').text(nick),
                    $('<div class="d-inline-block text-truncate" class="last_message" />').text(last_msg)))

            .append($('<div class="p-2 ml-auto text-center hght_64 wdth_70" />')
                .append($('<div class="last_msg_time" />').text(time),
                    $('<div class="msg_count badge badge-pill bg_badge" />').text(msg_count)))
            .appendTo('.list_users');
    }


    function add_dialog(nick) {
        socket.emit('get last message', nick);
        socket.emit('get messages count', nick);
        let logo = nick.charAt(0).toUpperCase() + nick.charAt(1).toUpperCase();
        $('<li class="list-group-item d-flex flex-row user_block dialog" />').attr('id', nick + '_nick')
            .append($('<div class="user_photo" />').text(logo).css('background-color', get_bg_color(logo)))
            .append($('<div />')
                .append($('<div class="user_nickname" />').text(nick),
                    $('<div class="d-inline-block text-truncate last_message" />').text('default_last_msg')))

            .append($('<div class="p-2 ml-auto text-center hght_64 wdth_70" />')
                .append($('<div class="last_msg_time" />').text('10:15'),
                    $('<div class="msg_count badge badge-pill bg_badge" />').text(0)))
            .appendTo('.list_users');
    }


    function get_bg_color(nickname) {
        return user_photo_colors[nickname.charCodeAt() % user_photo_colors.length];
    }


    function show_dialog() {
        
        $(this).find('.msg_count').hide();

        $('.header_panel').show();
        $('#send_block').show();
        $('.list_users').find('.user_block').removeClass('clicked');;
        $(this).addClass('clicked');
        localStorage.to = $(this).find('.user_nickname').html();
        show_user_info(localStorage.to);
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
        $('.emoji-wysiwyg-editor').empty();
        $("#msg_to_send").css('height', '40');
        let time = Date.now();

        let dialog = $('#' + to + '_nick');
        dialog.attr('data-sort', time);
        dialog.find('.last_msg_time').text(last_msg_time_converter(time));
        if (localStorage.nickname == to) {
            dialog.find('.last_message').text('You: ' + text);
        } else {
            dialog.find('.last_message').text(text);
        }
        $messages
            .append($('<div class="answer right"></div>')
                .append($('<div class="text"></div>').text(text))
                .append($('<div class="time"></div>').text(msg_time_converter(time))));

        $(".scroll").scrollTop($('.scroll').prop('scrollHeight') + $('.scroll').height());
        sort_dialogs_by_time();
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


    function delete_conversation() {
        $('#' + localStorage.to + '_nick').remove();
        hide_messages_body();
    }


    function clear_history() {
        clean_msg();
    }


    function set_user_data() {
        let nick = localStorage.to.toUpperCase();
        $("#user_info_logo").text(nick.charAt(0) + nick.charAt(1));
        $('#modal_user_nickname').text(localStorage.to);
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

    // Добавить сохранение на сервере
    function change_theme(theme) {
        localStorage.theme = theme;
        $('#theme-switcher').attr('href', 'css/themes/' + theme);
    }


    function load_theme() {
        if (localStorage.theme) {
            change_theme(localStorage.theme);
            if (localStorage.theme === 'dark.css') {
                $('#night_mode').prop('checked', true);
            }
        }
    }

    socket.on('get message', (text, from, timestamp) => {
        let time = msg_time_converter(timestamp);
        if (from !== localStorage.nickname) {
            $messages.append($('<div class="answer left" />')
                .append($('<div class="text" />').text(text))
                .append($('<div class="time" />').text(time)));
        }
        sort_dialogs_by_time();
    });


    socket.on('finded user', (nickname) => {
        add_finded_user(nickname, 'last_msg', '11', 'time');
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
        dialog.attr('data-sort', time);
        dialog.find('.last_msg_time').text(last_msg_time_converter(time));
        if (localStorage.nickname == author) {
            dialog.find('.last_message').text('You: ' + text);
        } else {
            dialog.find('.last_message').text(text);
        }
        sort_dialogs_by_time();
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
    }
    return msg_date + '.' + format_time((msg_month + 1).toString()) + '.' + msg_year.toString().slice(-2);
}


function connect_error_alert() {
    if (show_alert_error) {
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
                        show_alert_error = false;
                        swal.close();
                        break;
                    default:
                        swal.close();
                }
            });
    }
}