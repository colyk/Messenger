$(function() {

    const
        $leftList = $('.left_list'),
        $centerList = $('.center_list'),
        $activeBut = $('.active_but_bar'),
        $activeButLeft = $('#active_but_bar1'),
        $activeButCenter = $('#active_but_bar2');
    let
        flagScreen = 1;

    $('[data-wanker]').wanker({ delay: 93000, duration: 2000 });

    // $('.center_list').css({ 'background-image': 'url("https://webfon.top/wp-content/uploads/2016/10/4.jpg"', 'background-size': 'auto' });
    $('.header_panel').hide();
    $('.chat-body').hide();
    $('#send_block').hide();

    $("html").css({ 'height': $(window).height() });
    $(".left_list").css({ 'height': $(window).height() });
    $(".center_list").css({ 'height': $(window).height() });
    $(".scroll").css({ 'height': $(window).height() - 89 });
    $(".scroll_left").css({ 'height': $(window).height() - $(".header_panel_left") });
    $('.search_input').css({ "margin-right": "10px" });

    $(window).resize(function() {
        $("html").css({ 'height': $(window).height() });
        $(".left_list").css({ 'height': $(window).height() });
        $(".center_list").css({ 'height': $(window).height() });
        $(".scroll").css({ 'height': $(window).height() - 89 });
        $(".scroll_left").css({ 'height': $(window).height() - $(".header_panel_left") });
    });
    
    $('.scroll').scroll(function() {
        if ($(this).scrollTop() > $('.scroll').prop('scrollHeight') - $('.scroll').height() - 100) {
            $('.scroll_but').fadeOut();
        } else {
            $('.scroll_but').fadeIn();
        }
    });
    $('.scroll_but').click(function() {

        $('.scroll').animate({ scrollTop: $('.scroll').prop('scrollHeight') - $('.scroll').height() }, 800); //$('.messages').height() не правильно
    })

    $activeButLeft.addClass('active_but_bar');
    $activeButCenter.addClass('active_but_bar');

    $activeButLeft.on('click', clickActiveBut);
    $activeButCenter.on('click', clickActiveBut);


    if (localStorage.nickname) {
        let nick = localStorage.nickname.toUpperCase();
        $(".my_photo").text(nick.charAt(0) + nick.charAt(1));
    } else {
        $(".my_photo").text("UN");
    }

    function clickActiveBut() {
        $activeButLeft.toggleClass('rotate');
        $activeButCenter.toggleClass('rotate');
        if (flagScreen == 0) {
            $leftList.css({
                'display': 'block'
            });
            if ($leftList.hasClass('col-xl-0')) {
                $leftList
                    .removeClass('col-xl-0')
                    .addClass('col-xl-3');
                $centerList
                    .removeClass('col-xl-12')
                    .addClass('col-xl-9');
            }
            if ($leftList.hasClass('col-lg-0')) {
                $leftList
                    .removeClass('col-lg-0')
                    .addClass('col-lg-4');
                $centerList
                    .removeClass('col-lg-12')
                    .addClass('col-lg-8');
            }
            if ($leftList.hasClass('col-md-0')) {
                $leftList
                    .removeClass('col-md-0')
                    .addClass('col-md-4');
                $centerList
                    .removeClass('col-md-12')
                    .addClass('col-md-8');
            }
            flagScreen = 1;
        } else {
            $leftList.css({ 'display': 'none' });
            if ($leftList.hasClass('col-xl-3')) {
                $leftList
                    .removeClass('col-xl-3')
                    .addClass('col-xl-0');
                $centerList
                    .removeClass('col-xl-9')
                    .addClass('col-xl-12');
            }
            if ($leftList.hasClass('col-lg-4')) {
                $leftList
                    .removeClass('col-lg-4')
                    .addClass('col-lg-0');
                $centerList
                    .removeClass('col-lg-8')
                    .addClass('col-lg-12');
            }
            if ($leftList.hasClass('col-md-4')) {
                $leftList
                    .removeClass('col-md-4')
                    .addClass('col-md-0');
                $centerList
                    .removeClass('col-md-8')
                    .addClass('col-md-12');
            }      
            flagScreen = 0;
        }
    }
});

function clickFindFile() {
    document.getElementById('uploadfile').click();
}

function clickLoadFile() {
    document.getElementById('loadfile').click();
}