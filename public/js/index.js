var burger_wrapper = document.querySelector('.burger-wrapper');
var top_line = document.querySelector('.top-line');
var middle_line = document.querySelector('.middle-line');
var bottom_line = document.querySelector('.bottom-line');
var burger = document.querySelector('.burger');
var aside = document.querySelector('aside');
var body = document.querySelector('body');

window.onload = function () {

    burger.addEventListener('click', function () {
        if (top_line.classList.contains("top-line_rotate")) {
            //Исчезновение
            rotate();
            setTimeout(to_mid, 200);
            aside.classList.remove('aside__visible');
            body.style.height = 'auto';
            body.style.overflow = 'unset';
        } else {
            //Появление
            aside.classList.add('aside__visible');
            to_mid();
            setTimeout(rotate, 200);
            body.style.height = '100%';
            body.style.overflow = 'hidden';
        }
    });
};

function rotate() {
    top_line.classList.toggle('top-line_rotate');
    middle_line.classList.toggle('top-line_rotate');
    bottom_line.classList.toggle('bottom-line_rotate');
}

function to_mid() {
    top_line.classList.toggle('top-line_mid');
    bottom_line.classList.toggle('bottom-line_mid');
}


var scroll_temp = 0;

window.onscroll = function() {

    var current_scroll = window.pageYOffset;

    if (scroll_temp < current_scroll) {
        //Вниз
        scroll_temp = current_scroll;
        hide_burger();
    } else {
        //Вверх
        scroll_temp = current_scroll;
        show_burger();
    }

};

function show_burger () {
    burger_wrapper.style.bottom = '3%';
}

function hide_burger () {
    burger_wrapper.style.bottom = '-16%';
}





