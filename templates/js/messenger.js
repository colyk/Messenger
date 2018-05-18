$(function() {
    const socket = io.connect('http://127.0.0.1:3000/', { 'transports': ['websocket'] });

    socket.on('connect', function() {
        socket.emit('room', localStorage.nickname);
    });

    // обрезка размера смс
    // $('#last_message').css('width', $('#last_message').html().length * ($('body').css('font-size').slice(0, -2) / 2));

    $(window).resize(function() {
        $('#last_message').css('max-width', $('.list_users').width() / 1.4);
    });


    $('#find').keyup(find_user);
    $('.list_users').on("click", ".user_block", show_dialog);
    $('#send_btn').click(send_message);
    $('#msg_to_send').keypress(function(event) {
        if (event.which == 13) {
            send_message();
            event.preventDefault();
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


    function add_user_block(nick, last_msg, msg_count) {
        let logo = nick.charAt(0).toUpperCase() + nick.charAt(1).toUpperCase();
        $('<li class="list-group-item d-flex flex-row user_block finded" ></li>')
            .append($('<div class="user_photo"></div>').html(logo))
            .append($('<div></div>')
                .append($('<div id="user_nickname"></div>').html(nick),
                    $('<div class="d-inline-block text-truncate" id="last_message"></div>').html(last_msg)))
            .append($('<div class="ml-auto p-2 badge badge-primary badge-pill "></div>').html(msg_count))
            .appendTo('.list_users');
    }

    function show_dialog() {
        $('.list_users').find('.user_block').removeClass('clicked');;
        $(this).addClass('clicked');
        show_user_info($(this).find('#user_nickname').html());
        show_user_msg();
        localStorage.to = $(this).find('#user_nickname').html();
    }

    function show_user_info(nickname) {
        // body...
    }

    function show_user_msg() {
        // body...
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

    socket.on('get message', (text) => {
        $('.messages').append($('<p class="text-justify text-dark bg-light text_left msg"></p>').html(text))
        console.log('Incoming message:', text);
    });

    socket.on('finded user', (nickname) => {
        console.info('User ' + nickname + ' exist');
        add_user_block(nickname, 'last_msg', '11');
    });

    socket.on('user doesnt exist', (nickname) => {
        console.info('User ' + nickname + ' doesnt exist');
    });
});