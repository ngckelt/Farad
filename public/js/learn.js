// Получение данных и создание основных блоков
var next_btn = document.querySelector('.next');
var formula_name = document.querySelector('.formula__name');
var require = document.querySelector('.require');
var items_wrapper = document.querySelector('.items-wrapper');
var item_back = document.querySelector('.back');
var target_items_wrapper = document.getElementById('target__items-wrapper');
var exit_btn = document.getElementById('exit');

//Счетчики
var math_counter = 0;
var phys_counter = 0;
var error_counter;

var first_attempt = 0;
var second_attempt = 0;
var third_attempt = 0;
var greater_attempt = 0;

//Начально время
var date = new Date();
var start_time = date.getTime();

//Клик по кнопке выход
exit_btn.addEventListener('click', function () {

    var url = decodeURI(window.location.href);
    temp = url.split('=');
    var sbj = temp[temp.length -1];
    
    if (sbj != 'demo') {
        var math_number = window.math_counter;
        var phys_number = window.phys_counter;
    
        var date = new Date();
        var end_time = date.getTime();
    
        var session_time = msToTime(end_time - window.start_time);
    
        document.cookie = "new_data=True; path=/profile";
        document.cookie = "first_attempt=" + window.first_attempt + "; path=/profile";
        document.cookie = "second_attempt=" + window.second_attempt + "; path=/profile";
        document.cookie = "third_attempt=" + window.third_attempt + "; path=/profile";
        document.cookie = "greater_attempt=" + window.greater_attempt + "; path=/profile";
        document.cookie = "session_time=" + session_time + "; path=/profile";
        document.cookie = "total=" + parseInt(math_number + phys_number) + "; path=/profile";
    
        var request = new XMLHttpRequest();
        request.open('POST', 'update_formuls');
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.onload = function () {
            response = JSON.parse(request.responseText);
            if (response.status == 200) {
                window.location.href = "/profile";
            } 
        };
        request.send('math_count=' + math_number + '&phys_count=' + phys_number);

    } else {
        window.location.href = "/";
    }

});

function msToTime(duration) {
    var seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}

window.onload = function () {

    var url = decodeURI(window.location.href);

    temp = url.split('=');

    var theme_temp = temp[1];

    var theme = theme_temp.split('&');

    var theme = theme[0];
    var sbj = temp[2];

    document.cookie = "new_data=False; path=/profile";

    get_data(sbj, theme);
};

//Получение формул из json
function get_data(sbj, theme) {

    if (theme == 'none' && sbj != 'fav') {
        var request = new XMLHttpRequest();
        request.open('GET', '/public/json/' + sbj + '.json');
        request.onload = function () {
            var data = JSON.parse(request.responseText);
            data = shuffle(data);
            start(data);
        };
        request.send();
    } else if (theme == 'none' && sbj == 'fav') {
        get_favorite();
    } else {
        theme = theme.toLowerCase();
        var request = new XMLHttpRequest();
        request.open('GET', '/public/json/' + sbj + '.json');
        request.onload = function () {
            var data = JSON.parse(request.responseText);
            var new_data = [];
            for (i = 0; i < data.length; i++) {
                if (data[i].theme.toLowerCase() == theme) {
                    new_data.push(data[i]);
                }
            }

            new_data = shuffle(new_data);
            start(new_data);
        };
        request.send();
    }
}

//Получение id-шников избранных формул
function get_favorite() {
    var user_formuls = [];

    var request = new XMLHttpRequest();
    request.open('GET', 'get_fav'); 
    request.onload = function () {
        var data = request.responseText;        
        for (i = 0; i < data.length; i += 3) {
            var temp = [data[i], data[i + 1], data[i + 2]].join('');
            user_formuls.push(temp);
        }
        get_phys_data(user_formuls);
    };
    request.send();
}

//Получение формул по физике, согласно избранным формулам
function get_phys_data(user_formuls) {

    var request = new XMLHttpRequest();
    request.open('GET', '/public/json/phys.json');
    request.onload = function () {
        var data = JSON.parse(request.responseText);

        var phys_json_data = [];

        for (i = 0; i < user_formuls.length; i++) {
            for (x = 0; x < data.length; x++) {
                if (user_formuls[i] == data[x].id) {
                    phys_json_data.push(data[x]);
                }
            }
        }

        get_math_data(user_formuls, phys_json_data);

    };
    request.send();
}

//Получение формул по математике, согласно избранным формулам
function get_math_data(user_formuls, phys_json_data) {
    var request = new XMLHttpRequest();
    request.open('GET', '/public/json/math.json');
    request.onload = function () {
        var data = JSON.parse(request.responseText);
        var math_json_data = [];

        for (i = 0; i < user_formuls.length; i++) {
            for (x = 0; x < data.length; x++) {
                if (user_formuls[i] == data[x].id) {
                    math_json_data.push(data[x]);
                }
            }
        }

        var final_data = phys_json_data.concat(math_json_data);
        start(final_data);

    };
    request.send();
}

function start(data) {

    //Если произошла ошибка при загрузке данных
    if (data.length == 0 || data == undefined || data == null) {

        document.getElementById('preloader_text').innerHTML = 'При загрузке данных произошла ошибка';

        setTimeout(function () {
            window.location.href = '/';
        }, 1000); 

    } else {
        document.getElementById('preloader').remove();
    }

    var x = 0;
    var formula_arr = [];

    for (i = 0; i < data.length; i++) {
        formula_arr.push(i);
    }

    formula_arr = shuffle(formula_arr);

    var clear = false;

    var require = document.getElementsByClassName('require');
    require[0].classList.remove('correct');

    next_btn.addEventListener('click', function (e) {

        require[0].classList.remove('correct');

        if (clear) {
            clear_block(items_wrapper);
            clear_block(numerator);
            clear_block(denumerator);
            clear_block(target_items_wrapper);
        }

        render(data, formula_arr[x]);
        x++;

        if (x == data.length) {
            x = 0;
            formula_arr = shuffle(formula_arr);
        }

        this.classList.add('next_btn_disabled');
        clear = true;
        var btn_overlay = document.createElement('div');
        btn_overlay.classList.add('btn_overlay');
        this.appendChild(btn_overlay);
    
        var btn_max_scale = Math.max(this.clientWidth, this.clientHeight);
    
        var click_pos = this.getBoundingClientRect();
    
        btn_overlay.style.left = e.clientX - click_pos.left - (btn_max_scale / 30) + 'px';
        btn_overlay.style.top = e.clientY - click_pos.top - (btn_max_scale / 30) + 'px';
    
        btn_overlay.style.height = 10+ 'px';
        btn_overlay.style.width = 10 + 'px';

    });

}

function clear_block(block) {
    if (block) {
        while (block.firstChild) {
            block.removeChild(block.firstChild);
        }
    }
}

//Создание дроби
function render(data, i) {

    window.error_counter = 5;

    var numerator_block = document.createElement('div');
    numerator_block.id = 'numerator';
    numerator_block.classList.add('numerator__center');


    var fractional_line = document.createElement('div');
    fractional_line.classList.add('fractional__line');
    fractional_line.classList.add('fractional__line__hidden');


    var denumerator_block = document.createElement('div');
    denumerator_block.classList.add('denumerator__hidden');
    denumerator_block.id = 'denumerator';


    target_items_wrapper.appendChild(numerator_block);
    target_items_wrapper.appendChild(fractional_line);
    target_items_wrapper.appendChild(denumerator_block);

    formula_name.innerHTML = '<h4>' + data[i].name + '</h4>';
    require.innerHTML = '<p>' + data[i].require + '=</p>';

    var numerator = document.getElementById('numerator');
    var denumerator = document.getElementById('denumerator');
    var fractional_line = document.querySelector('.fractional__line');


    var numerator_order = data[i].numerator_order;
    var denumerator_order = data[i].denumerator_order;
    var items = [];
    var empty_boxes = [];
    var numerator_arr = [];//Элементы числителя 
    var denumerator_arr = [];//Элементы знаменателя
    var data_numerator = data[i].numerator; //Числитель
    var data_denumerator = data[i].denumerator; // Знаментель
    var numerator_length = data[i].numerator.length; //Длина числителя
    var subject = data[i].subject;// Предмет 
    var hint = data[i].hint; //Подсказка для формулы

    //Числитель
    for (x = 0; x < data_numerator.length; x++) {
        var numerator__item = document.createElement('div');
        numerator__item.innerHTML = data_numerator[x];
        numerator__item.classList.add('item');
        items.push(numerator__item);
        numerator_arr.push(numerator__item);
        var empty_box = document.createElement('div');
        empty_box.classList.add('target');
        numerator.appendChild(empty_box);
        empty_boxes.push(empty_box);
    }

    //Если есть множитель
    if (data[i].factor) {
        var factor__item = document.createElement('div');
        factor__item.innerHTML = data[i].factor;
        factor__item.classList.add('item');
        numerator_arr.push(factor__item);
        items.push(factor__item);
        var factor = document.createElement('div');
        factor.classList.add('target');
        factor.classList.add('factor');
        numerator.appendChild(factor);
        empty_boxes.push(factor);
    }

    //Знаменатель
    if (data_denumerator) {
        fractional_line.classList.remove('fractional__line__hidden');
        denumerator_block.classList.remove('denumerator__hidden');
        numerator_block.classList.remove('numerator__center');
        for (x = 0; x < data_denumerator.length; x++) {
            var denumerator__item = document.createElement('div');
            denumerator__item.innerHTML = data_denumerator[x];
            denumerator__item.classList.add('item');
            items.push(denumerator__item);
            denumerator_arr.push(denumerator__item);
            var empty_box = document.createElement('div');
            empty_box.classList.add('target');
            denumerator.appendChild(empty_box);
            empty_boxes.push(empty_box);
        }
    }

    var random_chars = shuffle(data[i].random_chars);
    var random_chars_arr = [];

    var n = 0;
    //Добавление случайных символов
    while (items.length < 10) {
        var random_item = document.createElement('div');
        random_item.innerHTML = random_chars[n];
        random_item.classList.add('item');
        items.push(random_item);
        random_chars_arr.push(random_item);
        n++;
    }

    items = shuffle(items);

    for (x = 0; x < items.length; x++) {
        items_wrapper.appendChild(items[x]);
    }

    var symbol = document.getElementsByClassName('item');
    var item_anchors_arr = [];

    //Создание опорных блоков
    for (i = 0; i < symbol.length; i++) {
        var item_anchor = document.createElement('div');
        item_anchor.classList.add('item__anchor');
        items_wrapper.appendChild(item_anchor);
        item_anchors_arr.push(item_anchor);
    }

    // Установка ширины якорей
    var icons = document.getElementsByClassName('item');
    var anchors = document.getElementsByClassName('item__anchor');
    for (i = 0; i < anchors.length; i++) {
        anchors[i].style.width = icons[i].offsetWidth - 4 + 'px';
        anchors[i].style.height = icons[i].offsetHeight - 4 + 'px';
    }

    //установа позиции букв по опорным элементам
    for (i = 0; i < items.length; i++) {
        items[i].style.left = findPosX(item_anchors_arr[i]) + 'px';
        items[i].style.top = findPosY(item_anchors_arr[i]) + 'px';
    }

    var clicked_btn = [];

    var n = 0;

    empty_boxes[0].classList.add('target__active');

    //Клик по символу
    for (i = 0; i < symbol.length; i++) {
        symbol[i].addEventListener('click', function () {

            try {
                var symbol_width = this.offsetWidth;
                var symbol_height = this.offsetHeight;
    
                //Изменение размероа пустой ячейки
                var target_item = document.getElementsByClassName('target__active');
                var target_items = document.getElementsByClassName('target');
                if (target_item[0]) {
                    if (window.screen.width > 540) {
                        target_item[0].style.width = symbol_width - 4 + 'px';
                        target_item[0].style.height = symbol_height - 4 + 'px';
                    } else {
                        target_item[0].style.width = symbol_width - 8 + 'px';
                        target_item[0].style.height = symbol_height - 8 + 'px';
                    }
                }
                if (target_items[n]) {
                    target_items[n].style.transition = 'all 300ms ease';
                    target_items[n].style.border = '2px solid rgba(0,0,0,0)';
                }
    
                //удаление id
                for (m = 0; m < items_wrapper.children.length; m++) {
                    items_wrapper.children[m].id = '';
                }
    
                //Установка атрибутов и id для символа
                this.style.pointerEvents = 'none';
                this.setAttribute("initial_pos_x", findPosX(this));
                this.setAttribute("initial_pos_y", findPosY(this));
                this.id = 'active_item';
                n++;
    
                //Отправка формулы на проверку
                if (n == numerator_arr.length + denumerator_arr.length) {
                    setTimeout(function () {
                        formula_valid(numerator_arr, denumerator_arr, clicked_btn, random_chars_arr, empty_boxes[0], numerator_order, denumerator_order, data_numerator, data_denumerator, numerator_length, factor__item, empty_boxes, subject, hint);
                        n = 0;
                        item_back.classList.add('disabled');
                        return n;
                    }, 301);
                }
    
                if (n > 0 && item_back.classList.contains('disabled')) {
                    item_back.classList.remove('disabled');
                }
    
                clicked_btn.push(this);
    
                //Смещение символов
                var target_items_pos = get_position();
                for (i = 0; i < clicked_btn.length; i++) {
                    clicked_btn[i].style.left = target_items_pos[i][0] + 'px';
                    clicked_btn[i].style.top = target_items_pos[i][1] + 'px';
                }
    
                if (n < numerator_arr.length + denumerator_arr.length) {
                    empty_boxes[n].classList.add('target__active');
                }
    
                if (n > 0) {
                    empty_boxes[n - 1].classList.remove('target__active');
                }
    
                return clicked_btn;
            } catch (e) {
            }

        });
    }

    //Возвращение блока на исходную позицию
    item_back.addEventListener('click', function () {
        var active_item = document.getElementById('active_item');
        if (active_item) {
            active_item.style.left = active_item.getAttribute('initial_pos_x') + 'px';
            active_item.style.top = active_item.getAttribute('initial_pos_y') + 'px';
            active_item.removeAttribute('initial_pos_x');
            active_item.removeAttribute('initial_pos_y');
            active_item.style.pointerEvents = 'all';
            active_item.id = '';
        }

        clicked_btn.pop();

        if (clicked_btn.length > 0) {
            clicked_btn[clicked_btn.length - 1].id = 'active_item';
        } else if (clicked_btn.length == 1) {
            clicked_btn[0].id = 'active_item';
        }

        n--;

        if (n >= 0) {
            empty_boxes[n + 1].classList.remove('target__active');
            empty_boxes[n].style.width = '50px';
            empty_boxes[n].style.height = '50px';
            empty_boxes[n].style.border = '2px solid #f4f4f4';
            empty_boxes[n].removeAttribute('style');
            empty_boxes[n].classList.add('target__active');
        }

        // Смещение кнопок
        var target_items_pos = get_position();
        for (i = 0; i < clicked_btn.length; i++) {

            clicked_btn[i].style.left = target_items_pos[i][0] + 'px';
            clicked_btn[i].style.top = target_items_pos[i][1] + 'px';
        }

        if (n == 0) {
            item_back.classList.add('disabled');
        }
    });

    var anchors_pos = [];

    //Определение позиции якорей
    for (i = 0; i < item_anchors_arr.length; i++) {
        var anc_x_y = [];
        anc_x_y[0] = findPosX(item_anchors_arr[i]);
        anc_x_y[1] = findPosY(item_anchors_arr[i]);
        anchors_pos.push(anc_x_y);
    }

    return random_chars_arr;

}

//Проверка зполнения
function formula_valid(numerator, denumerator, clicked_btn_arr, random_chars_arr, active_box, numerator_order, denumerator_order, data_numerator, data_denumerator, numerator_length, factor__item, empty_boxes, subject, hint) {

    var numerator_item_pos = [];
    var denumerator_item_pos = [];

    //Массив с позициями числителя
    for (i = 0; i < numerator.length; i++) {
        num_item_pos = findPosY(numerator[i]);
        numerator_item_pos.push(num_item_pos);
    }

    //Массив с позициями знаменателя 
    for (i = 0; i < denumerator.length; i++) {
        denum_item_pos = findPosY(denumerator[i]);
        denumerator_item_pos.push(denum_item_pos);
    }

    //Валидация массива
    var num_valid = valid_array(numerator_item_pos, 'numerator', clicked_btn_arr, numerator_order, data_numerator, numerator_length, factor__item, numerator);
    var denum_valid = valid_array(denumerator_item_pos, 'denumerator', clicked_btn_arr, denumerator_order, data_denumerator, numerator_length, factor__item);

    //Верно
    if ((num_valid == true) && (denum_valid == true)) {
        next_btn.classList.remove('next_btn_disabled');
        item_back.classList.add('disabled');

        if (document.getElementById('help_btn') != null) {
            document.getElementById('help_btn').parentNode.removeChild(document.getElementById('help_btn'));
        }

        if (document.getElementById('hint') != null) {
            document.getElementById('hint').parentNode.removeChild(document.getElementById('hint'));
        }        

        var btn_overlay = document.getElementsByClassName('btn_overlay');

        for (i = 0; i < btn_overlay.length; i++) {
            btn_overlay[i].remove();
        }

        require.classList.add('correct');
        require.style.border = 'none';

        for (i = 0; i < random_chars_arr.length; i++) {
            random_chars_arr[i].classList.remove('red');
        }

        for (i = 0; i < numerator.length; i++) {
            numerator[i].classList.add('correct');
        }

        for (i = 0; i < denumerator.length; i++) {
            denumerator[i].classList.add('correct');
        }

        for (i = 0; i < random_chars_arr.length; i++) {
            random_chars_arr[i].classList.add('disabled__item');
            random_chars_arr[i].style.pointerEvents = 'none';
        }

        var fr_line = document.getElementsByClassName('fractional__line');
        fr_line[0].style.backgroundColor = '#022dba';

        if (subject == 'phys') {
            window.phys_counter++;
        } else if (subject == 'math') {
            window.math_counter++;
        }

        switch (window.error_counter) {
            case 5:
                window.first_attempt++;
                break;
            case 4:
                window.second_attempt++;
                break;
            case 3:
                window.third_attempt++;
                break;
            default:
                window.greater_attempt++;
        }

        // Смещение кнопок
        var target_items_pos = get_position();
        for (i = 0; i < clicked_btn_arr.length; i++) {
            clicked_btn_arr[i].style.left = target_items_pos[i][0] + 'px';
            clicked_btn_arr[i].style.top = target_items_pos[i][1] + 'px';
        }

    //Неверно
    } else {

        if (window.error_counter > -1) {
            window.error_counter--;
        }

        //Отобразить блок с подсказкой
        if (window.error_counter == 2 && hint != undefined) {
            var hint_block = document.createElement('div');
            hint_block.id = 'hint';
            hint_block.innerHTML = '<p>' + hint + '</p>';

            var close_hint = document.createElement('p');
            close_hint.id = 'close_hint';
            close_hint.innerHTML = 'Закрыть';

            document.getElementsByTagName('body')[0].appendChild(hint_block);
            document.getElementById('hint').appendChild(close_hint);

            var close_hint_btn = document.getElementById('close_hint');

            //Скрыть блок с подсказкой
            close_hint_btn.addEventListener('click', function () {
                document.getElementById('hint').remove();
            });

        }

        //Отображение кнопки чтобы убрать лишние символы

        if (window.error_counter == 0) {
            var help_btn = document.createElement('a');
            help_btn.classList.add('btn');
            help_btn.id = 'help_btn';
            help_btn.innerHTML = 'Убрать лишние символы';
            document.getElementsByClassName('nav')[0].appendChild(help_btn);
            document.getElementById('help_btn').addEventListener('click', function () {
                hide_random_items(random_chars_arr);
                document.getElementById('help_btn').parentNode.removeChild(document.getElementById('help_btn'));
            });
        }

        for (i = 0; i < empty_boxes.length; i++) {
            empty_boxes[i].removeAttribute('style');
        }

        var avtive_empty_item = document.querySelector('.target');
        avtive_empty_item.removeAttribute('style');

        for (i = 0; i < numerator.length; i++) {
            numerator[i].classList.remove('transparent_bg');
        }

        for (i = 0; i < denumerator.length; i++) {
            denumerator[i].classList.remove('transparent_bg');
        }

        for (i = 0; i < random_chars_arr.length; i++) {
            random_chars_arr[i].classList.remove('transparent_bg');
        }

        //Возвращение нажатых кнопок на исходную позицию
        for (i = 0; i < clicked_btn_arr.length; i++) {
            move_to_origin_x = clicked_btn_arr[i].getAttribute('initial_pos_x');
            move_to_origin_y = clicked_btn_arr[i].getAttribute('initial_pos_y');
            clicked_btn_arr[i].style.left = move_to_origin_x + 'px';
            clicked_btn_arr[i].style.top = move_to_origin_y + 'px';
            clicked_btn_arr[i].removeAttribute('initial_pos_x');
            clicked_btn_arr[i].removeAttribute('initial_pos_y');
            clicked_btn_arr[i].style.pointerEvents = 'all';
        }

        to_red(numerator, denumerator, random_chars_arr);
        setTimeout(function () {
            remove_red(numerator, denumerator, random_chars_arr);
        }, 500);

        function to_red(numerator, denumerator, random_chars_arr) {

            for (i = 0; i < numerator.length; i++) {
                if (numerator[i].classList.contains('factor') == false) {
                    numerator[i].classList.add('red');
                }
            }

            for (i = 0; i < denumerator.length; i++) {
                denumerator[i].classList.add('red');
            }

            for (i = 0; i < random_chars_arr.length; i++) {
                random_chars_arr[i].classList.add('red');
            }
        }

        function remove_red(numerator, denumerator, random_chars_arr) {
            for (i = 0; i < numerator.length; i++) {
                numerator[i].classList.remove('red');
            }

            for (i = 0; i < denumerator.length; i++) {
                denumerator[i].classList.remove('red');
            }

            for (i = 0; i < random_chars_arr.length; i++) {
                random_chars_arr[i].classList.remove('red');
            }
        }

    }

    active_box.classList.add('target__active');

    while (clicked_btn_arr.length > 0) {
        clicked_btn_arr.pop();
    }
}

//Удаление лишних элементов
function hide_random_items(items) {

    for (i = 0; i < items.length; i++) {
        items[i].style.display = 'none';
    }
}

function valid_array(array, type, clicked_btn_arr, order_status, data_array, numerator_length, factor__item, numerator) {

    var valid = false;

    //Длинный числитель 
    if (array.length > 1 && type == 'numerator') {

        var valid_factor = true;

        if (factor__item != undefined) {
            valid_factor = check_factor(factor__item.innerHTML, numerator, clicked_btn_arr);
        }

        if (valid_factor) {

            //Удаление множителя из нажатых кнопок
            var clicked_btn_arr_temp = [];

            for (i = 0; i < clicked_btn_arr.length; i++) {
                clicked_btn_arr_temp.push(clicked_btn_arr[i]);
            }

            var index = clicked_btn_arr_temp.indexOf(factor__item);
            if (index > -1) {
                clicked_btn_arr_temp.splice(index, 1);
            }

            valid = check_order_stastus('numerator', valid, numerator_length, order_status, data_array, clicked_btn_arr_temp);
        }

        //Длинный знаменатель
    } else if (array.length > 1 && type == 'denumerator') {

        var clicked_btn_arr_temp = [];

        for (i = 0; i < clicked_btn_arr.length; i++) {
            clicked_btn_arr_temp.push(clicked_btn_arr[i]);
        }

        if (factor__item != undefined) {
            //Удаление множителя из нажатых кнопок
            var index = clicked_btn_arr_temp.indexOf(factor__item);
            if (index > -1) {
                clicked_btn_arr_temp.splice(index, 1);
            }
        }

        valid = check_order_stastus('denumerator', valid, numerator_length, order_status, data_array, clicked_btn_arr_temp);

        //Одиночный числитель    
    } else if (array.length == 1 && type == 'numerator') {

        if (clicked_btn_arr[0].innerHTML == data_array[0]) {
            valid = true;
        } else {
            valid = false;
        }

        //Одиночный знаменатель    
    } else if (array.length == 1 && type == 'denumerator') {

        if (clicked_btn_arr[clicked_btn_arr.length - 1].innerHTML == data_array[0]) {
            valid = true;
        } else {
            valid = false;
        }

        //Пустой знаменатель    
    } else if (array.length == 0 && type == 'denumerator') {
        valid = true;
    }

    return valid;
}


//Проверка множителя
function check_factor(factor, numerator, clicked_btn_arr) {

    var temp = numerator.length - 1;
    var user_factor = clicked_btn_arr[temp].innerHTML;

    if (factor == user_factor) {
        return true;
    } else {
        return false;
    }
}

//Проверка порядка в массиве
function check_order_stastus(type, valid, numerator_length, order_status, data_array, clicked_btn_arr) {

    var index_start = 0;
    var index_end = numerator_length;

    if (type == 'denumerator') {
        index_start = numerator_length;
        index_end = clicked_btn_arr.length;
    }

    switch (order_status) {
        case 'diff':
            var user_arr = [];
            for (i = index_start; i < index_end; i++) {
                user_arr.push(clicked_btn_arr[i].innerHTML);
            }

            if (arraysEqual(user_arr, data_array)) {
                valid = true;
            } else {
                valid = false;
            }
            break;

        case 'sum':
            var user_arr = [];
            for (i = index_start; i < index_end; i++) {
                user_arr.push(clicked_btn_arr[i].innerHTML);
            }

            var index = [];
            for (i = 0; i < data_array.length; i++) {
                if (data_array[i] == '<span class=\"icon-phys_plus\"></span>') {
                    index.push(i);
                }
            }

            var data_temp = [];

            for (i = 0; i < data_array.length; i++) {
                data_temp.push(data_array[i]);
            }

            for (i = 0; i < index.length; i++) {
                if (user_arr[index[i]] == '<span class=\"icon-phys_plus\"></span>' && arraysEqual(user_arr.sort(), data_temp.sort())) {
                    valid = true;
                    break;
                } else {
                    valid = false;
                }
            }
            break;

        case 'sum_mult':
            var user_arr = [];
            for (i = index_start; i < index_end; i++) {
                user_arr.push(clicked_btn_arr[i].innerHTML);
            }

            var data_sort = [];
            var user_sort = [];
            var data_temp = [];
            var user_temp = [];
            for (i = 0; i <= data_array.length; i++) {
                if (i == data_array.length) {
                    data_sort.push(data_temp);
                    break;
                } else if (data_array[i] == '<span class=\"icon-phys_plus\"></span>') {
                    data_sort.push(data_temp);
                    data_temp = [];
                } else {
                    data_temp.push(data_array[i]);
                }
            }

            for (i = 0; i <= user_arr.length; i++) {
                if (i == user_arr.length) {
                    user_sort.push(user_temp);
                    break;
                } else if (user_arr[i] == '<span class=\"icon-phys_plus\"></span>') {
                    user_sort.push(user_temp);
                    user_temp = [];
                } else {
                    user_temp.push(user_arr[i]);
                }
            }

            var data_arr = sort_array(data_sort);
            var user_arr = sort_array(user_sort);

            valid = multi_array_equal(data_arr, user_arr);

            break;

        case 'diff_mult':
            var user_arr = [];
            for (i = index_start; i < index_end; i++) {
                user_arr.push(clicked_btn_arr[i].innerHTML);
            }

            var data_sort = [];
            var user_sort = [];
            var data_temp = [];
            var user_temp = [];
            for (i = 0; i <= data_array.length; i++) {
                if (i == data_array.length) {
                    data_sort.push(data_temp);
                    break;
                } else if (data_array[i] == '<span class=\"icon-phys_minus\"></span>') {
                    data_temp.push(data_array[i]);
                    data_sort.push(data_temp);
                    data_temp = [];
                } else {
                    data_temp.push(data_array[i]);
                }
            }

            for (i = 0; i <= user_arr.length; i++) {
                if (i == user_arr.length) {
                    user_sort.push(user_temp);
                    break;
                } else if (user_arr[i] == '<span class=\"icon-phys_minus\"></span>') {
                    user_temp.push(user_arr[i]);
                    user_sort.push(user_temp);
                    user_temp = [];
                } else {
                    user_temp.push(user_arr[i]);
                }
            }

            for (i = 0; i < data_sort.length; i++) {
                var sort_me = false;
                for (x = 0; x < data_sort[i].length; x++) {
                    if (data_sort[i][x] == '<span class=\"icon-phys_minus\"></span>') {
                        sort_me = false;
                        break;
                    } else {
                        sort_me = true;
                    }
                }

                if (sort_me) {
                    data_sort[i].sort();
                }
            }


            for (i = 0; i < user_sort.length; i++) {
                var sort_me = false;
                for (x = 0; x < user_sort[i].length; x++) {
                    if (user_sort[i][x] == '<span class=\"icon-phys_minus\"></span>') {
                        sort_me = false;
                        break;
                    } else {
                        sort_me = true;
                    }
                }

                if (sort_me) {
                    user_sort[i].sort();
                }
            }

            valid = multi_array_equal(user_sort, data_sort);

            break;

        case 'diff_sum':

            var user_arr = [];
            for (i = index_start; i < index_end; i++) {
                user_arr.push(clicked_btn_arr[i].innerHTML);
            }

            var data_sort = [];
            var user_sort = [];
            var data_temp = [];
            var user_temp = [];

            for (i = 0; i <= data_array.length; i++) {
                if (i == data_array.length) {
                    data_sort.push(data_temp);
                    break;
                } else if (data_array[i] == '<span class=\"icon-phys_minus\"></span>') {
                    data_sort.push(data_temp);
                    data_temp = [];
                    data_temp.push(data_array[i]);
                } else {
                    data_temp.push(data_array[i]);
                }
            }

            for (i = 0; i <= user_arr.length; i++) {
                if (i == user_arr.length) {
                    user_sort.push(user_temp);
                    break;
                } else if (user_arr[i] == '<span class=\"icon-phys_minus\"></span>') {
                    user_sort.push(user_temp);
                    user_temp = [];
                    user_temp.push(user_arr[i]);
                } else {
                    user_temp.push(user_arr[i]);
                }
            }

            valid = multi_array_equal(data_sort, user_sort);

            break;

        case 'none':

            var user_arr = [];
            for (i = index_start; i < index_end; i++) {
                user_arr.push(clicked_btn_arr[i].innerHTML);
            }

            if (arraysEqual(data_array.sort(), user_arr.sort())) {
                valid = true;
            } else {
                valid = false;
            }

            break;
    }
    
    return valid;
}

//Нахождение позиций пустых блоков
function get_position() {
    empty_box_pos = [];

    for (i = 0; i < numerator.children.length; i++) {
        var x = findPosX(numerator.childNodes[i]);
        var y = findPosY(numerator.childNodes[i]);
        var active_pos = [x, y];
        empty_box_pos.push(active_pos);
    }

    for (i = 0; i < denumerator.children.length; i++) {
        var x = findPosX(denumerator.childNodes[i]);
        var y = findPosY(denumerator.childNodes[i]);
        var active_pos = [x, y];
        empty_box_pos.push(active_pos);
    }

    return empty_box_pos; //Позиции пустых блоков
}


function findPosX(obj) {
    var curleft = 0;
    if (obj.offsetParent) {
        while (true) {
            curleft += obj.offsetLeft;
            if (!obj.offsetParent) {
                break;
            }
            obj = obj.offsetParent;
        }
    } else if (obj.x) {
        curleft += obj.x;
    }
    return curleft;
}

function findPosY(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        while (true) {
            curtop += obj.offsetTop;
            if (!obj.offsetParent) {
                break;
            }
            obj = obj.offsetParent;
        }
    } else if (obj.y) {
        curtop += obj.y;
    }
    return curtop;
}

//Равенство массивов
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length)
        return false;
    for (var i = arr1.length; i--;) {
        if (arr1[i] != arr2[i])
            return false;
    }
    return true;
}

//Сортировка многомерного массива
function sort_array(arr) {
    for (i = 0; i < arr.length; i++) {

        if (arr[i][i]) {
            if (arr[i + 1]) {
                if (arr[i].length < arr[i + 1].length) {
                    var temp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = temp;
                }
            }
            arr[i].sort();
        }
    }
    return arr;
}

//Проверка двумерного массива

function multi_array_equal(arr_1, arr_2) {
    var equal = false;
    for (i = 0; i < arr_1.length; i++) {
        for (j = 0; j < arr_1.length; j++) {
            if (arr_2[j]) {
                if ( arraysEqual(arr_1[i].sort(), arr_2[j].sort())) {
                    equal = true;
                    break;
                } else {
                    equal = false;
                }
            }
        }
        if (!equal) {
            return false;
        }
    }
    return true;
}

function shuffle(arr) {
    var j, temp;
    for (var i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }
    return arr;
}





