//scroll user lists
$("div.scroll").scrollTop(300);
//виводить розміри екрана
var width = screen.width;
var height = screen.height;
document.write(width);
document.write('x' + height);
//document.getElementsByTagName('main').style.height = screen.height;
//скриття і відкриття bar
var flag = 0;
document.getElementsByClassName('button_bar')[0].onclick = function() {
    if (flag == 0) {
        document.getElementById("left_list").style.position = 'absolute';
        document.getElementById("left_list").style.display = 'block';
        document.getElementById("left_list").style.margin = '60px 0 0 0 ';
        document.getElementById("left_list").style.background = '#fff';
        flag = 1;
    } else {
        document.getElementById("left_list").style.display = 'none';
        document.getElementById("left_list").style.position = 'static';
        flag = 0;
    }
}