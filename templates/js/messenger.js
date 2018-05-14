$(function() {
	const socket = io.connect('http://127.0.0.1:3000/', { 'transports': ['websocket'] });

    $('#find').keyup(find_user);

    function find_user() {
        $('.list_users').css('display', 'none');
        socket.emit('find user', $('#find').val())
    }

    socket.on('finded user', (nickname) => {
        console.info('User ' + nickname + ' exist');
    });

    socket.on('user doesnt exist', (nickname) => {
        console.info('User ' + nickname + ' doesnt exist');
    });
});