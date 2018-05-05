$(function() {
    var $left_list = $('#left_list');
    $("div.scroll.messages").scrollTop(300);

    var socket = io.connect('http://127.0.0.1:3000/', { 'transports': ['websocket'] });

    $('#button_bar').click(function() {
        $left_list.toggle();
    });



});