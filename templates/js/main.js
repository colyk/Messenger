$(function() {
    //scroll messages
    $("div.scroll.messages").scrollTop(300);

    var eleml = document.getElementsByClassName('left_list')[0];
    var elemc = document.getElementsByClassName('center_list')[0];
    var flagl = 1;
    document.getElementsByClassName('button_bar')[0].onclick = function() {
        if (flagl == 0) {
            eleml.style.display = 'block';
            eleml.style.background = '#fff';
            if (eleml.classList.contains("col-xl-0")) {
                eleml.classList.remove("col-xl-0");
                eleml.classList.add("col-xl-3");
                elemc.classList.remove("col-xl-12");
                elemc.classList.add("col-xl-9");
            }
            if (eleml.classList.contains("col-lg-0")) {
                eleml.classList.remove("col-lg-0");
                eleml.classList.add("col-lg-4");
                elemc.classList.remove("col-lg-12");
                elemc.classList.add("col-lg-8");
            }
            if (eleml.classList.contains("col-md-0")) {
                eleml.classList.remove("col-md-0");
                eleml.classList.add("col-md-4");
                elemc.classList.remove("col-md-12");
                elemc.classList.add("col-md-8");
            }

            flagl = 1;
        } else {
            eleml.style.display = 'none';
            if (eleml.classList.contains("col-xl-3")) {
                eleml.classList.remove("col-xl-3");
                eleml.classList.add("col-xl-0");
                elemc.classList.remove("col-xl-9");
                elemc.classList.add("col-xl-12");
            }
            if (eleml.classList.contains("col-lg-4")) {
                eleml.classList.remove("col-lg-4");
                eleml.classList.add("col-lg-0");
                elemc.classList.remove("col-lg-8");
                elemc.classList.add("col-lg-12");
            }
            if (eleml.classList.contains("col-md-4")) {
                eleml.classList.remove("col-md-4");
                eleml.classList.add("col-md-0");
                elemc.classList.remove("col-md-8");
                elemc.classList.add("col-md-12");
            }
            flagl = 0;
        }
    }
    if (localStorage.nickname) {
        let nick = localStorage.nickname.toUpperCase();
        $(".nick_photo").text(nick.charAt(0) + nick.charAt(1));
    } else {
        $(".nick_photo").text("UN");
    }
});