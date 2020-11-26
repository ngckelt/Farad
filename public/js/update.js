/* Проверка форм */

$(document).ready(function () {

    var update_btn = $('#update_btn');

    var login = $('#login'),
        email = $('#email'),
        current_password = $('#current_password'),
        new_password = $('#new_password'),
        new_password_confirm = $('#new_password_confirm');
    
    var login_expression = /[^a-z0-9_-]/i,
        password_expresion = /[^a-z0-9\_\-\#\,\*]/i,
        email_expression = /^[a-z0-9_-]+@[a-z0-9-]+\.[a-z]{2,12}$/i;

    //Проверка логина
    login.keyup(function () {
        check_input(login, 'text', login_expression, '#login_error');
    });

    //Проверка почты
    email.keyup(function () {
       check_input(email, 'email', email_expression, '#email_error');
    });

    //Проверка текущего пароля
    current_password.keyup(function () {
        check_input(current_password, 'text', password_expresion, '#current_password_error');
    });

    //Проверка нового пароля
    new_password.keyup(function () {
        if ($(this).val() !==  new_password_confirm.val() && new_password_confirm.val() != '') {
            show_error_block('#new_password_confirm_error', 'Пароли не совпадают');
            return false;
        }
        check_input(new_password, 'text', password_expresion, '#new_password_error');
    });

    //Подтверждение нового пароля
    new_password_confirm.keyup(function () {
        if ($(this).val() !==  new_password.val()) {
            show_error_block('#new_password_confirm_error', 'Пароли не совпадают');
            return false;
        } 
        check_input(new_password_confirm, 'text', password_expresion, '#new_password_confirm_error');
    });

    //Проверка инпута
    function check_input(input, input_type, expression, error_block) {
        var val = $.trim(input.val());
        if (val != '') {
            if (input_type == 'text') {
                if (val.search(expression) != -1) {
                    show_error_block(error_block, 'Запрещенный символ!');
                    return false;
                } else {
                    hide_error_block(error_block);
                }
            } else {
                if (val.search(expression) != 0) {
                    show_error_block(error_block, 'Данное поле заполнено некорректно');
                    return false;
                } else {
                    hide_error_block(error_block);
                }
            }
        } else {
            show_error_block(error_block, 'Обязательное поле');
            return false;
        }

        return true;
    }

    //Показать блок с ошибкой
    function show_error_block (block, text) {
        $(block).text(text);
        $(block).css({
            'bottom': - ($(block).height() + 40) + 'px',
            'opacity': 1
        });
    }

    //Скрыть блок с ошибкой
    function hide_error_block (block) {
        $(block).css({
            'bottom': - ($(block).height() + 90) + 'px',
            'opacity': 0
        }); 
    }


    /* Отправка данных */
    update_btn.on('click', function() {
        update_data();
    });

    function update_data () {
        $.ajax({
            url: 'update_user',
            type: 'POST',
            cache: false,
            dataType: 'html',
            data: {
                'login': login.val(),
                'email': email.val(),
                'current_password': current_password.val(),
                'new_password': new_password.val(),
                'new_password_confirm': new_password_confirm.val(),
                'token': $('#update_token').val()
            },
            beforeSend: function () {

            },
            success: function (data) {
                response = JSON.parse(data);
                if (response.status != 200) {
                    if (response.status == 419) {  
                        location.replace('/');
                    } else {
                        show_error_block(response.error_block, response.message);
                    }
                } else {
                    //Если ошибки нет
                    location.reload();
                }

            }
        });
        return false;
    };

});


