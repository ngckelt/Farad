$(document).ready(function () {

    var url = window.location.href;

    temp = url.split('/');

    get_data(temp[temp.length - 1]);
});

function get_data(sbj) {

    var user_formuls = [];
    $.ajax('get_fav', {
        async: false,
        success: function (data) {
            for (i = 0; i < data.length; i += 3) {
                var temp = [data[i], data[i + 1], data[i + 2]].join('');
                user_formuls.push(temp);
            }
        }
    });

    var data;

    switch (sbj) {
        case 'math':
            $.ajax('/public/json/math.json', {
                async: false,
                success: function (json_arr) {
                    data = json_arr;
                }
            });
            break;
        case 'phys':
            $.ajax('/public/json/phys.json', {
                async: false,
                success: function (json_arr) {
                    data = json_arr;
                }
            });
            break;
        case 'fav':
            var math_data;
            var phys_data;
            $.ajax('/public/json/math.json', {
                async: false,
                success: function (json_arr) {
                    math_data = json_arr;
                }
            });
            $.ajax('/public/json/phys.json', {
                async: false,
                success: function (json_arr) {
                    phys_data = json_arr;
                }
            });
            math_data = math_data.concat(phys_data);
            data = math_data;
            break;
    }

    /* 
    @ data - формулы из json
    @ user_formuls - id-шники формул пользователя
    @ sbj - Предмет
    */

    if (data != undefined && data != '') {
        start(data, user_formuls, sbj);
    } else {
        $('#container').html('Произошла ошибка при загрузке данных. Повторите попытку позже');
    }
}

function start(json_data, user_formuls, sbj) {

    var input = $('#find');
    var val, temp;

    function search() {
        search_interval = setInterval(function () {
            temp = val;
            val = $.trim(input.val());

            if (val != '' && val != temp) {
                get_user_formula(val.toLowerCase());
            }

        }, 2000);
    }

    function get_user_formula(val) {

        $.ajax({
            url: '/public/json/phys.json',
            type: 'GET',
            asunc: false,
            success: function () {
                
                clearInterval(search_interval);
                $('#container').html('');
                for (i = 0; i < json_data.length; i++) {
                    if (levenshtein(json_data[i].name.toLowerCase(), val) <= 5) {
                        create_formula(json_data[i], user_formuls, false);
                    }
                }

                add_to_fav();
                remove_from_fav();
                search();
                $('#back').removeClass('disabled_btn');
            }
        });
    }

    if (sbj == 'fav') {

        for (i = 0; i < user_formuls.length; i++) {
            for (x = 0; x < json_data.length; x++) {
                if (user_formuls[i] == json_data[x].id) {
                    create_formula(json_data[x], user_formuls, false);
                    break;
                }
            }
        }
        add_to_fav();
        remove_from_fav();

    } else {
        create_base_set(json_data, user_formuls, sbj);
    }

    search();

    /* Клик по кнопке назад */
    $('#back').click(function () {
        location.reload();
    });

    if ($('#container').children().length == 0) {
        $('#remove').addClass('disabled_btn');
        $('#everything').addClass('disabled_btn');
        $('#container').html('Избранных формул нет');
    }
}

var container = $('#container');

function create_base_set(data, user_formuls, sbj) {

    var themes = [];

    for (i = 0; i < data.length; i++) {
        themes.push(data[i].theme);
    }

    themes = arrayUnique(themes);

    //Удаление дубликатов из массива
    function arrayUnique(arr) {
        return arr.filter((e, i, a) => a.indexOf(e) == i)
    }

    for (i = 0; i < data.length; i++) {

        for (x = 0; x < themes.length; x++) {
            if (data[i].theme == themes[x]) {

                container.append('<div class="wrapper"></div>');

                $('.wrapper:eq(-1)').append('<h3 class="formula__name">' + data[i].theme + '</h3>');

                $('.wrapper:eq(-1)').append('<div class="bts-wpapper"></div>')

                $('.bts-wpapper:eq(-1)').append('<a href="learn?theme=' + data[i].theme + '&sbj=' + sbj + '" class="btn sbj__btn"> Изучать </a>');

                $('.bts-wpapper:eq(-1)').append('<a class="btn sbj__btn view_formuls" data-theme="' + data[i].theme + '"> Посмотреть формулы </a>');

                var index = themes.indexOf(data[i].theme);
                if (index > -1) {
                    themes.splice(index, 1);
                }
            }
        }
    }

    view_formuls(user_formuls, sbj);

}

/* 
@ data - Объект с формулой
@ user_formuls - id-шники избранных формул
@ clear - нужно ли очистить контейнер
@ user_formula - Название формулы, которую запрашивает пользователь
@ json_data - Формулы из json-а
*/

function create_formula(data, user_formuls, clear) {

    if (data == '') {
        return false;
    }

    if (clear) {
        container.html('');
    }

    container.append('<div class="wrapper" data-id="' + data.id + '"></div>');
    $('.wrapper:eq(-1)').append('<h3 class="formula__name">' + data.name + '</h3>');
    $('.wrapper:eq(-1)').append('<div class="formula-wrapper"></div>');
    $('.formula-wrapper:eq(-1)').append('<div class="require"><p>' + data.require + '=</p></div>');
    $('.formula-wrapper:eq(-1)').append('<div class="formula"></div>');
    $('.formula:eq(-1)').append('<div class="numerator"></div>');

    for (x = 0; x < data.numerator.length; x++) {
        $('.numerator:eq(-1)').append('<div class="item">' + data.numerator[x] + '</div>');
    }

    if (data.factor) {
        $('.numerator:eq(-1)').append('<div class="item factor">' + data.factor + '</div>');
    }

    $('.formula:eq(-1)').append('<div class="fractional__line"></div>');
    $('.formula:eq(-1)').append('<div class="denumerator"></div>');

    if (data.denumerator) {
        $('.denumerator:eq(-1)').addClass('denumerator denumerator__show');
        $('.fractional__line:eq(-1)').addClass('fractional__line fractional__line__show');
        $('.numerator:eq(-1)').addClass('numerator numerator__center');
        for (x = 0; x < data.denumerator.length; x++) {
            $('.denumerator:eq(-1)').append('<div class="item">' + data.denumerator[x] + '</div>');
        }
    }

    var attr_val = $('.wrapper:eq(-1)').attr('data-id');

    var fav_temp;
    for (x = 0; x < user_formuls.length; x++) {
        if (user_formuls[x] == attr_val) {
            fav_temp = '<a class="favorite remove_from_fav">Убрать из избранного <i class="fas fa-heart"></i></a>';
            break;
        } else {
            fav_temp = '<a class="favorite add_to_fav">Добавить в избранное <i class="fas fa-heart"></i></a>';
        }
    }

    $('.wrapper:eq(-1)').append(fav_temp); 
}

/* Просмотр формул по теме */
function view_formuls(user_formuls, sbj) {

    var json_data;

    $.ajax({
        url: '/public/json/' + sbj + '.json',
        type: 'GET',
        asunc: false,
        success: function (data) {
            json_data = data;
        }
    });

    $('.view_formuls').click(function () {

        $('#back').removeClass('disabled_btn');
        var theme = $(this).attr('data-theme');

        $('#container').html('');

        for (i = 0; i < json_data.length; i++) {
            if (json_data[i].theme == theme) {
                create_formula(json_data[i], user_formuls, false);
            }
        }
        add_to_fav();
        remove_from_fav();
    });
}

/* Добавление в избранное */
function add_to_fav() {

    $('.add_to_fav').on('click', function () {
        $(this).css('pointer-events', 'none');
        var formula_id = $(this).parent().attr('data-id');

        $.ajax({
            url: 'add_fav',
            type: 'POST',
            cache: false,
            data: { 'formula_id': formula_id },
            dataType: 'html',
            beforeSend: function () {
                $('.favorite').each(function () {
                    $(this).css('pointer-events', 'none');
                });
            },
            success: function (data) {
                if (data == 'error') {
                    location.reload();
                }
                $('.favorite').each(function () {
                    $(this).css('pointer-events', 'all');
                });
            }
        });


        $(this).removeClass('add_to_fav');
        $(this).removeClass('favorite');
        $(this).addClass('disabled');
        $(this).html('Формула добавлена');

        return false;
    });

}

/* Удаление из избранного */
function remove_from_fav() {

    $('.remove_from_fav').on('click', function () {
        $(this).css('pointer-events', 'none');
        var formula_id = $(this).parent().attr('data-id');

        $.ajax({
            url: 'remove_fav',
            type: 'POST',
            cache: false,
            data: { 'formula_id': formula_id },
            dataType: 'html',
            beforeSend: function () {
                $('.favorite').each(function () {
                    $(this).css('pointer-events', 'none');
                });
            },
            success: function (data) {
                if (data == 'error') {
                    location.reload();
                }
                $('.favorite').each(function () {
                    $(this).css('pointer-events', 'all');
                });
            }
        });

        $(this).removeClass('remove_from_fav');
        $(this).removeClass('favorite');
        $(this).addClass('disabled');
        $(this).html('Формула удалена');
    });

    return false;
}


//Расстояние левенштейна

function levenshtein(s1, s2, costs) {
    var i, j, l1, l2, flip, ch, chl, ii, ii2, cost, cutHalf;
    l1 = s1.length;
    l2 = s2.length;

    costs = costs || {};
    var cr = costs.replace || 1;
    var cri = costs.replaceCase || costs.replace || 1;
    var ci = costs.insert || 1;
    var cd = costs.remove || 1;

    cutHalf = flip = Math.max(l1, l2);

    var minCost = Math.min(cd, ci, cr);
    var minD = Math.max(minCost, (l1 - l2) * cd);
    var minI = Math.max(minCost, (l2 - l1) * ci);
    var buf = new Array((cutHalf * 2) - 1);

    for (i = 0; i <= l2; ++i) {
        buf[i] = i * minD;
    }

    for (i = 0; i < l1; ++i, flip = cutHalf - flip) {
        ch = s1[i];
        chl = ch.toLowerCase();

        buf[flip] = (i + 1) * minI;

        ii = flip;
        ii2 = cutHalf - flip;

        for (j = 0; j < l2; ++j, ++ii, ++ii2) {
            cost = (ch === s2[j] ? 0 : (chl === s2[j].toLowerCase()) ? cri : cr);
            buf[ii + 1] = Math.min(buf[ii2 + 1] + cd, buf[ii] + ci, buf[ii2] + cost);
        }
    }
    return buf[l2 + cutHalf - flip];
}

/* Удалить все избранного */

$('#remove').click(function () {
    $(this).addClass('disabled_btn');
    if ($('#container').html() != '') {
        $.ajax({
            url: 'remove_all',
            type: 'POST',
            cache: false,
            beforeSend: function () {
                $(this).css('pointer-events', 'none');
            },
            success: function (data) {
                response = JSON.parse(data);
                if (response.status == 200) {
                    $('#container').html('Все формулы успешно удалены');
                } else {
                    $('#container').html('При удалении формул произошла ошибка. Попробуйте еще раз');
                }
            }
        });
    }
});
















