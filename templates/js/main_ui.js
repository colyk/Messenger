$(function() {

    const
        $leftList = $('.left_list'),
        $centerList = $('.center_list'),
        $activeBut = $('.active_but_bar'),
        $activeButLeft = $('#active_but_bar1'),
        $activeButCenter = $('#active_but_bar2'),
        $find = $('#find');
    let flagScreen = 1;

    $('[data-wanker]').wanker({ delay: 5000, duration: 2000 });

    $('.header_panel').hide();
    $('#send_block').hide();
    find_btn_animation();

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
});



function clickFindFile() {
    document.getElementById('uploadfile').click();
}

function clickLoadFile() {
    document.getElementById('loadfile').click();
}