const user_photo_colors = ['#EDA86CFF', '#EE7AAEFF', '#65AADDFF', '#555555FF'];
let show_alert_error = true;
const defaultBgImageUrl = 'https: //webfon.top/wp-content/uploads/2016/10/4.jpg';

function setBgImage() {
	if(!localStorage.backgroundImg){
		localStorage.backgroundImg = defaultBgImageUrl;
	}
	$('#modal_cur_img').find('img').attr('src', localStorage.backgroundImg);
    $('.center_list').css({ 'background-image': 'url(' + localStorage.backgroundImg + ')', 'background-size': 'auto' });
}


function last_msg_time_converter(UNIX_timestamp) {
    let msg_time = new Date(UNIX_timestamp);
    let now = new Date();

    let msg_year = msg_time.getFullYear();
    let msg_month = msg_time.getMonth();
    let msg_date = msg_time.getDate();

    let now_month = now.getMonth();
    let now_date = now.getDate();

    if (now_date == msg_date && now_month == msg_month) {
        let hour = format_time(msg_time.getHours().toString());
        let min = format_time(msg_time.getMinutes().toString());
        return hour + ':' + min + '';
    }
    return msg_date + '.' + format_time((msg_month + 1).toString()) + '.' + msg_year.toString().slice(-2);
}


function format_time(time) {
    if (time.length == 1) return time = '0' + time;
    return time;
}


function msg_time_converter(UNIX_timestamp) {
    let a = new Date(UNIX_timestamp);
    let hour = format_time(a.getHours().toString());
    let min = format_time(a.getMinutes().toString());
    return hour + ':' + min;
}


function get_bg_color(nickname) {
    return user_photo_colors[nickname.charCodeAt() % user_photo_colors.length];
}


function connect_error_alert() {
    if (show_alert_error) {
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
                        show_alert_error = false;
                        swal.close();
                        break;
                    default:
                        swal.close();
                }
            });
    }
}