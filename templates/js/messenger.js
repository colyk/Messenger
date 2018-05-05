//scroll user lists
$("div.scroll").scrollTop(300);
//виводить розміри екрана
var width = screen.width;
var height = screen.height;
document.write(width);
document.write('x' + height);
//document.getElementsByTagName('main').style.height = screen.height;
//скриття і відкриття bar
var eleml = document.getElementsByClassName('left_list')[0];
var elemc = document.getElementsByClassName('center_list')[0];

var flagl = 1;
document.getElementsByClassName('button_bar')[0].onclick = function() {
    if (flagl == 0) {
        document.getElementsByClassName("left_list")[0].style.display = 'block';
        document.getElementsByClassName("left_list")[0].style.background = '#fff';
        if(eleml.classList.contains("col-xl-0")){
            eleml.classList.remove("col-xl-0");
            eleml.classList.add("col-xl-3");
            elemc.classList.remove("col-xl-12");
            elemc.classList.add("col-xl-9");
        }
        if(eleml.classList.contains("col-lg-0")){
            eleml.classList.remove("col-lg-0");
            eleml.classList.add("col-lg-4");
            elemc.classList.remove("col-lg-12");
            elemc.classList.add("col-lg-8");
        }
        if(eleml.classList.contains("col-md-0")){
            eleml.classList.remove("col-md-0");
            eleml.classList.add("col-md-4");
            elemc.classList.remove("col-md-12");
            elemc.classList.add("col-md-8");
        }

        flagl = 1;
    } else {
        document.getElementsByClassName("left_list")[0].style.display = 'none';
        if(eleml.classList.contains("col-xl-3")){
            eleml.classList.remove("col-xl-3");
            eleml.classList.add("col-xl-0");
            elemc.classList.remove("col-xl-9");
            elemc.classList.add("col-xl-12");
        }
        if(eleml.classList.contains("col-lg-4")){
            eleml.classList.remove("col-lg-4");
            eleml.classList.add("col-lg-0");
            elemc.classList.remove("col-lg-8");
            elemc.classList.add("col-lg-12");
        }
        if(eleml.classList.contains("col-md-4")){
            eleml.classList.remove("col-md-4");
            eleml.classList.add("col-md-0");
            elemc.classList.remove("col-md-8");
            elemc.classList.add("col-md-12");
        }
        flagl = 0;
    }
}
// add classList.add
// delete classList.remove
// заміна classList.toggle
// перевірка наявності classList.contains

// добавление нескольких классов
//elem.classList.add( "foo", "bar" );
// возвращает "true" если у класса есть класс "foo", в противном случае "false"
//console.log( el.classList.contains("foo") );

// var elem = document.getElementsByClassName('left_list')[0];
// elem.classList.remove("col-12");
