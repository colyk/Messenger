const availableUserPhotoColors = ['#EDA86CFF', '#EE7AAEFF', '#65AADDFF', '#555555FF'];
let isAlertShown = true;
const defaultBgImageUrl = 'https: //webfon.top/wp-content/uploads/2016/10/4.jpg';

function setBgImage() {
    if (!localStorage.backgroundImg) {
        localStorage.backgroundImg = defaultBgImageUrl;
    }
    $('#modal_cur_img').find('img').attr('src', localStorage.backgroundImg);
    $('.center_list').css({ 'background-image': 'url(' + localStorage.backgroundImg + ')', 'background-size': 'auto' });
    $('#row_images').find('img').each(function() {
        if ($(this).attr('src') === localStorage.backgroundImg) {
            $(this).parent().removeClass('not_choosen');
        }
    });
}


function setNotificationAllows() {
    if (!localStorage.allowNotification) {
        localStorage.allowNotification = false;
    } else if (localStorage.allowNotification == "true") {
        $('#notification').prop('checked', true);
    }
}


function converterLastMessageTime(unixTimestamp) {
    let msgTime = new Date(unixTimestamp);
    let now = new Date();

    let msgYear = msgTime.getFullYear();
    let msgMonth = msgTime.getMonth();
    let msgDate = msgTime.getDate();

    let nowMonth = now.getMonth();
    let nowDate = now.getDate();

    if (nowDate == msgDate && nowMonth == msgMonth) {
        let hour = formatTime(msgTime.getHours().toString());
        let min = formatTime(msgTime.getMinutes().toString());
        return hour + ':' + min + '';
    }
    return msgDate + '.' + formatTime((msgMonth + 1).toString()) + '.' + msgYear.toString().slice(-2);
}


function formatTime(time) {
    if (time.length == 1) return time = '0' + time;
    return time;
}


function converterMessageTime(unixTimestamp) {
    let msgTime = new Date(unixTimestamp);
    let hour = formatTime(msgTime.getHours().toString());
    let min = formatTime(msgTime.getMinutes().toString());
    return hour + ':' + min;
}


function getRandomBgColor(nickname) {
    return availableUserPhotoColors[nickname.charCodeAt() % availableUserPhotoColors.length];
}


function connectErrorAlert() {
    if (isAlertShown) {
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
                        isAlertShown = false;
                        swal.close();
                        break;
                    default:
                        swal.close();
                }
            });
    }
}


function createLogoByNickname(nickname) {
    let tmp = nickname.toUpperCase();
    return tmp.charAt(0) + tmp.charAt(1);
}