$(function() {
<<<<<<< HEAD
    $('[data-wanker]').wanker({ delay: 93000, duration: 2000 });
=======
>>>>>>> 24ea97a0412f10fa106807188a4ebada41198a39

    $('[data-wanker]').wanker({ delay: 6000, duration: 2000 });

    $('.center_list').css({'background-image': 'url("https://webfon.top/wp-content/uploads/2016/10/4.jpg"', 'background-size': 'auto'});
    $('.header_panel').hide();
    $('#send_block').hide();

    ///height screen
    $("html").css({ 'height': $(window).height() });
    $(".left_list").css({ 'height': $(window).height() });
    $(".center_list").css({ 'height': $(window).height() });
    $(".scroll").css({ 'maxHeight': $(".center_list").height() - 120 });
    $(window).resize(function() {
        $("html").css({ 'height': $(window).height()});
        $(".left_list").css({ 'height': $(window).height()});
        $(".center_list").css({ 'height': $(window).height()});
        $(".scroll").css({ 'height': $(".center_list").height() - $(".header_panel").height() - $("#send_block").height() - 30 });
    });


    //scroll messages
    $('::-webkit-scrollbar').css({ 'display': 'none' });
    $('::-webkit-scrollbar-thumb').css({ 'display': 'none' });
    $('.scroll').scroll(function() {
        if ($(this).scrollTop() == $('.messages').height()) { //змінити 0
            $('.scroll_but').fadeOut();
        } else {
            $('.scroll_but').fadeIn();
        }
    });
    $('.scroll_but').click(function() {
        $('.scroll').animate({ scrollTop: $('.messages').height()}, 800); //$('.messages').height() не правильно
    })


    $('#active_but_bar1').addClass('active_but_bar');
    $('#active_but_bar2').addClass('active_but_bar');
    var
        $leftList = $('.left_list'),
        $centerList = $('.center_list'),
        $activeBut = $('.active_but_bar'),
        flagScreen = 1;
    $activeBut.on('click', function() {
        if (flagScreen == 0) {
            $leftList.css({
                'display': 'block',
                'background': '#fff'
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
    });


    if (localStorage.nickname) {
        let nick = localStorage.nickname.toUpperCase();
        $(".my_photo").text(nick.charAt(0) + nick.charAt(1));
    } else {
        $(".my_photo").text("UN");
    }


    //переворот стрілки
    $activeBut.on('click', function() {
        $('#active_but_bar2').toggleClass('rotate');
        $('#active_but_bar1').toggleClass('rotate');
    });
});

//завантаження файла(клік по полю)
function clickFindFile() {
    document.getElementById('uploadfile').click();
}

function clickLoadFile() {
    document.getElementById('loadfile').click();
}