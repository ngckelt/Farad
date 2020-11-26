//Получение данных
var weekly_data;
var total_data;

function getcookie(a) {var b = new RegExp(a+'=([^;]){1,}');var c = b.exec(document.cookie);if(c) c = c[0].split('=');else return false;return c[1] ? c[1] : false;}


//Общие данные
$.ajax({
    url: 'get_total_data',
    type: 'POST',
    cache: false,
    async: false,
    dataType: 'html',
    success: function (data) {
        total_data = JSON.parse(data);
    }
});


//Данные за неделю
$.ajax({
    url: 'get_weekly_data',
    type: 'POST',
    cache: false,
    async: false,
    dataType: 'html',
    success: function (data) {
        weekly_data = JSON.parse(data);
    }
});

/* --------------------- Недельный график --------------------- */

var ctx = document.getElementById('weekly_chart').getContext('2d');
var chart_color = '#0b65ff';
var chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
        datasets: [{
            label: 'Количество формул в день за последнюю неделю',
            borderColor: chart_color,
            lineTension: 0,
            backgroundColor: chart_color,
            borderWidth: 4,
            fill: false,
            data: [
                weekly_data.mon,
                weekly_data.tue,
                weekly_data.wed,
                weekly_data.thu,
                weekly_data.fri,
                weekly_data.sat,
                weekly_data.sun
            ]
        }]
    },
});

$('#week_total').html(weekly_data.total);

/* --------------------- График с общими данными --------------------- */

var ctx = document.getElementById('total_chart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels: ['До использовния сайта', 'После использования сайта'],
        datasets: [{
            label: 'Результаты опроса',
            borderColor: chart_color,
            lineTension: 0,
            backgroundColor: chart_color,
            borderWidth: 4,
            fill: false,
            data: [
                54.44,
                56.66
            ]
        }]
    },

    // Configuration options go here
    options: {}
});

/* --------------------- Обратная связь --------------------- */

text_expression = /[^\.,!?() a-zA-Z0-9А-Яа-я]/u;

var textarea = $('#message');

textarea.keyup(function () {
    check_input(textarea, text_expression, '#message__alert');
});

function check_input(input, expression, error_block) {
    var val = $.trim(input.val());
    if (val != '') {
        if (val.search(expression) != -1) {
            $('#submit').addClass('disabled_btn');
            $(error_block).html('Запрещенный символ');
            $(error_block).css({
                'display': 'block',
                'width': '90%',
                'height': 'auto'
            });
        } else {
            $('#submit').removeClass('disabled_btn');
            $(error_block).css({
                'display': 'none',
            });
        }
    }

    return true;
}

$('#submit').click(function () {

    $.ajax({
        url: 'feedback',
        type: 'POST',
        cache: false,
        dataType: 'html',
        data: {
            'message': $('#message').val(),
            'token': $('#mail_token').val()
        },
        beforeSend: function () {
            $('#submit').css('pointer-events', 'none');
        },
        success: function (data) {

            response = JSON.parse(data);

            if (response.status != 200) {
                if (response.status == 419) {
                    $('#mail_security_error').html('Ошибка безопасности');
                    $('#mail_security_error').css({
                        'width': '90%',
                        'height': 'auto'
                    });
                    location.replace('/');
                } else {
                    $('#message__alert').css({
                        'display': 'block',
                        'background-color': '#af0202'
                    });
                    $('#message__alert').html(response.message);
                }
            } else {
                $('#message__alert').css({
                    'display': 'block',
                    'background-color': '#022dba'
                });
                $('#message__alert').html('Сообщение успешно отправлено');
                $('#message').val('');
            }
        }
    });

});


/*--------------------- Изменение темы --------------------- */


$('#light').click(function () {
    $('#color_mode').attr('href', 'public/css/light.css');
    document.cookie = "light_mode=true";
    location.reload();
});


$('#dark').click(function () {
    $('#color_mode').attr('href', '');
    document.cookie = "light_mode=false";
    location.reload();
});








