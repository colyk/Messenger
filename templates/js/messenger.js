$(function() {
    const socket = io.connect('http://127.0.0.1:3000/', { 'transports': ['websocket'] });

    $('#find').keyup(find_user);
    $('.list_users').on("click", ".user_block", show_dialog);

    function find_user() {
        if (!($('#find').val())) {
            show_user_blocks();
            hide_finded_users();
        } else {
            hide_user_blocks();
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
        console.log('dsfdsf');
        console.log($(this).find('#user_nickname').html());
    }


    socket.on('finded user', (nickname) => {
        console.info('User ' + nickname + ' exist');
        add_user_block(nickname, 'last_msg', '11');
    });

    socket.on('user doesnt exist', (nickname) => {
        console.info('User ' + nickname + ' doesnt exist');
    });
});