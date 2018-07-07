$(function() {
    const socket = io.connect('http://127.0.0.1:3000/', { 'transports': ['websocket'] });
    socket.on('connect', () => {
        socket.emit('room', localStorage.nickname);
        socket.emit('get dialog list');
    });

    socket.on("connect_error", () => connectErrorAlert());

    const $messages = $('.messages');
    const $find = $('#find');
    const $usersList = $('.list_users');

    initUI();

    function initUI() {
        loadTheme();
        createUserProfile();
        setEmoji();
        cutLastMsgWidth();

        setBgImage();
        setNotificationAllows();

        $('#send_btn').click(sendMessage);
        $('#sing_out').click(exit);
        $('#delete_conversation').click(deleteConversation);
        $('#clear_history').click(clearChatHistory);
        $('#user_info_show_but').click(setUserInfo);
        $('.img_picker').click(changeBgImage);
        $usersList.on("click", ".user_block", showDialogMessages);

        $('#night_mode').change(() => { $('#night_mode').is(':checked') ? changeTheme('dark.css') : changeTheme('light.css') });
        $('#notification').change(() => { $('#notification').is(':checked') ? allowNotification(true) : allowNotification(false) });

        $find.keyup(findUser);
        $(document).keyup((e) => { if (e.keyCode == 27) hideMessagesBody() });
        $('.emoji-wysiwyg-editor').keypress((e) => manageMessageBlockKeypress(e));
    }


    function loadTheme() {
        if (localStorage.theme) {
            changeTheme(localStorage.theme);
            if (localStorage.theme === 'dark.css') {
                $('#night_mode').prop('checked', true);
            }
        }
    }


    function changeTheme(theme) {
        localStorage.theme = theme;
        $('#theme-switcher').attr('href', 'css/themes/' + theme);
        // TODO: Добавить сохранение на сервере
        socket.emit('save theme', theme);
    }


    function createUserProfile() {
        socket.emit('get my info');
        if (localStorage.nickname) {
            $(".my_photo").text(createLogoByNickname(localStorage.nickname));
            $('#modal_my_nickname').text(localStorage.nickname);
        }
    }


    socket.on('put my info', (email) => {
        $('#modal_my_mail').text(email);
    });


    function setEmoji() {
        window.emojiPicker = new EmojiPicker({
            emojiable_selector: '[data-emojiable=true]',
            assetsPath: '../node_modules/emoji-picker-master/lib/img',
            popupButtonClasses: 'fa fa-smile'
        });
        window.emojiPicker.discover();
    }


    function cutLastMsgWidth() {
        $(window).resize(() => $('.last_message').css('max-width', $usersList.width() - 130));
    }


    function sendMessage() {
        let from = localStorage.nickname;
        let to = localStorage.to;
        let text = $('#msg_to_send').val().trim();
        if (text.length == 0) { return; }
        socket.emit('send message to', from, to, text);

        $('#msg_to_send').val('');
        $('.emoji-wysiwyg-editor').empty();
        $("#msg_to_send").css('height', '40');

        let time = Date.now();
        let dialog = $('#' + to + '_nick');
        dialog.attr('data-sort', time);
        dialog.find('.last_msg_time').text(converterLastMessageTime(time));
        if (localStorage.nickname === to) {
            dialog.find('.last_message').text('You: ' + text);
        } else {
            dialog.find('.last_message').text(text);
        }
        $messages
            .append($('<div class="answer right" />')
                .append($('<div class="text" />').text(text))
                .append($('<div class="time" />').text(converterMessageTime(time))));

        $(".scroll").scrollTop($('.scroll').prop('scrollHeight') + $('.scroll').height());
        sortDialogsByTime();
    }


    socket.on('get message', (text, from, timestamp) => {
        let time = converterMessageTime(timestamp);
        if (from !== localStorage.nickname) {
            $messages.append($('<div class="answer left" />')
                .append($('<div class="text" />').text(text))
                .append($('<div class="time" />').text(time)));
        }
        sortDialogsByTime();
        notificate(from, text);
        $(".scroll").scrollTop($('.scroll').prop('scrollHeight') + $('.scroll').height());
    });


    function sortDialogsByTime() {
        $usersList.find('li').sort((a, b) => b.dataset.sort - a.dataset.sort).appendTo($usersList);
    }


    function notificate(from, text) {
        if (localStorage.allowNotification == "true") {
            new Notification(from, {
                body: text,
                icon: '../images/logo.png'
            });
            // setTimeout(n.close(), 1 * 1000)
        }
    }


    function exit() {
        localStorage.clear();
        document.location.href = "registration.html";
    }


    function deleteConversation() {
        $('#' + localStorage.to + '_nick').remove();
        hideMessagesBody();
    }


    function hideMessagesBody() {
        $('.user_block ').removeClass('clicked');
        $('.center_list').css({ 'background-image': 'url(' + localStorage.backgroundImg + ')', 'background-size': 'auto' });
        $('.header_panel').hide();
        $('#send_block').hide();
        deleteMessages();
        $('.greeting').show();
    }


    function deleteMessages() {
        $messages.empty();
    }


    function clearChatHistory() {
        deleteMessages();
    }


    function setUserInfo() {
        $("#user_info_logo").text(createLogoByNickname(localStorage.to));
        $('#modal_user_nickname').text(localStorage.to);
    }


    function changeBgImage() {
        $('.img_picker').addClass('not_choosen');
        $(this).removeClass('not_choosen');
        let link = $(this).find('img').attr('src');
        $('.center_list').css({ 'background-image': 'url(' + link + ')', 'background-size': 'auto' });
        $('#modal_cur_img').find('img').attr('src', link);
        localStorage.backgroundImg = link;
    }


    function showDialogMessages() {
        $(this).find('.msg_count').hide();

        $('.header_panel').show();
        $('#send_block').show();
        $usersList.find('.user_block').removeClass('clicked');;
        $(this).addClass('clicked');
        localStorage.to = $(this).find('.user_nickname').html();
        fetchUserInfo(localStorage.to);
        fetchUserMessages();
        searchInputStyle();
    }


    function fetchUserInfo(nickname) {
        socket.emit('get user info', nickname);
    }


    socket.on('put user info', (nickname, online, time) => {
        $('#user_nickname').text(nickname);

        if (online) {
            $('.user_info_lasttime').text('online');
        } else {
            $('.user_info_lasttime').timeago('update', new Date(time));
        }
    });


    function fetchUserMessages() {
        socket.emit('get user messages', localStorage.nickname, localStorage.to);
        $('.greeting').hide();
    }


    socket.on('put user messages', (messages) => {
        deleteMessages();
        messages.forEach((msg) => loadMessagesFromDb(msg));
        $(".scroll").scrollTop($('.scroll').prop('scrollHeight') - $('.scroll').height());
    });


    function loadMessagesFromDb(msg) {
        let text = msg['text'];
        let time = converterMessageTime(msg['time']);
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


    function allowNotification(isAllowed) {
        if (!("Notification" in window)) {
            alert('Your browser doesn\'t support HTML Notifications. Please, update it.');
        } else if (isAllowed === true) {
            if (localStorage.allowNotification !== true) {
                Notification.requestPermission((permission) => {
                    if (permission === "granted") {
                        localStorage.allowNotification = true;
                    } else {
                        localStorage.allowNotification = false;
                    }
                });
            }
        } else {
            localStorage.allowNotification = false;
        }
    }


    function findUser() {
        if (!($find.val())) {
            showUserBlocks();
        } else {
            hideUserBlocks();
            socket.emit('find user', $find.val());
        }
        hideFindedUsers();
    }


    function showUserBlocks() {
        $usersList.find('.dialog').addClass('d-flex flex-row').show();
    }


    function hideUserBlocks() {
        $usersList.find('.dialog').removeClass('d-flex flex-row').hide();
    }


    socket.on('finded user', (nickname) => {
        addFindedUser(nickname, 'last_msg', '11', 'time');
    });


    function addFindedUser(nick, last_msg, msg_count, time) {
        let logo = createLogoByNickname(nick);
        $('<li class="list-group-item d-flex flex-row user_block finded" />')
            .append($('<div class="user_photo" />').text(logo).css('background-color', getRandomBgColor(logo)))
            .append($('<div />')
                .append($('<div class="user_nickname" />').text(nick),
                    $('<div class="d-inline-block text-truncate" class="last_message" />').text(last_msg)))

            .append($('<div class="p-2 ml-auto text-center hght_64 wdth_70" />')
                .append($('<div class="last_msg_time" />').text(time),
                    $('<div class="msg_count badge badge-pill bg_badge" />').text(msg_count)))
            .appendTo('.list_users');
    }


    function hideFindedUsers() {
        $usersList.find('.finded').removeClass('d-flex flex-row').hide();
    }


    function manageMessageBlockKeypress(event) {
        console.log(event.keyCode)
        if (event.keyCode == 13) {
            console.log('event')
            event.preventDefault();
            event.stopPropagation();
            sendMessage();
        } else if (event.ctrlKey) {
            caretStart = $('#msg_to_send')[0].selectionStart;
            caretEnd = $('#msg_to_send')[0].selectionEnd;
            $('#msg_to_send').val($('#msg_to_send').val().substring(0, caretStart) +
                "\n" +
                $('#msg_to_send').val().substring(caretEnd));
            $("#msg_to_send").css('height', '+=20');
            if ($("#msg_to_send").css('height') != '140px') $("#msg_to_send").css('margin-top', '-=20');
        }
    }


    socket.on('put dialog list', (dialogList) => {
        dialogList.forEach((nickname) => {
            addDialog(nickname);
        });
    });


    function addDialog(nick) {
        socket.emit('get last message', nick);
        socket.emit('get messages count', nick);
        let logo = createLogoByNickname(nick);
        $('<li class="list-group-item d-flex flex-row user_block dialog" />').attr('id', nick + '_nick')
            .append($('<div class="user_photo" />').text(logo).css('background-color', getRandomBgColor(logo)))
            .append($('<div />')
                .append($('<div class="user_nickname" />').text(nick),
                    $('<div class="d-inline-block text-truncate last_message" />').text('default_last_msg')))

            .append($('<div class="p-2 ml-auto text-center hght_64 wdth_70" />')
                .append($('<div class="last_msg_time" />').text('10:15'),
                    $('<div class="msg_count badge badge-pill bg_badge" />').text(0)))
            .appendTo('.list_users');
    }


    socket.on('put last message', (to, author, text, time) => {
        let dialog = $('#' + to + '_nick');
        dialog.attr('data-sort', time);
        dialog.find('.last_msg_time').text(converterLastMessageTime(time));
        if (localStorage.nickname == author) {
            dialog.find('.last_message').text('You: ' + text);
        } else {
            dialog.find('.last_message').text(text);
        }
        sortDialogsByTime();
    });

});