/* Проверка форм */

$(document).ready(function () {

    var signup = $('#signup_btn'),
        signin = $('#signin_btn');

    signup.addClass('disabled_btn'); 

    var reg_login = $('#reg_login'),
        email = $('#email'),
        reg_password = $('#reg_password'),
        reg_password_confirm = $('#reg_password_confirm'),
        auth_login = $('#login'),
        auth_password = $('#password');
    
    var login_expression = /[^a-z0-9_-]/i,
        password_expresion = /[^a-z0-9\_\-\#\,\*]/i,
        email_expression = /^[a-z0-9_-]+@[a-z0-9-]+\.[a-z]{2,12}$/i;

    var reg_login_valid = false,
        email_valid = false,
        reg_password_valid = false,
        reg_password_confirm_valid = false,
        auth_login_valid = false,
        auth_password_valid = false;

    //Проверка логина при регистрации
    reg_login.focus(function () {
        show_hint('#reg_login_hint');
    });

    reg_login.blur(function () {
        if ($(this).val().length < 3 && $(this).val().length != 0) {
            show_error_block('#reg_login_error', 'Данное поле должно содержать не менее 3 символов');
        } 
        hide_hint('#reg_login_hint');

        $.ajax({
            url: 'check_exists_user',
            type: 'POST',
            cache: false,
            dataType: 'html',
            data: {
                'field': 'login',
                'data': $(this).val(),
                'token': $('#reg_token').val()
            },
            success: function (data) {
                response = JSON.parse(data);
                if (response.status == 401) {
                    show_error_block('#reg_login_error', 'Пользователь с таким логином уже существует');
                } 
            }
        }); 

    });

    reg_login.keyup(function () {
        reg_login_valid = check_input(reg_login, 'text', login_expression, '#reg_login_error');
        unlock_signup_btn();
    });

    //Проверка email
    email.focus(function () {
        show_hint('#email_hint');
    });

    email.blur(function () {
        hide_hint('#email_hint');

        $.ajax({
            url: 'check_exists_user',
            type: 'POST',
            cache: false,
            dataType: 'html',
            data: {
                'field': 'email',
                'data': $(this).val(),
                'token': $('#reg_token').val()
            },
            success: function (data) {
                response = JSON.parse(data);
                if (response.status == 401) {
                    show_error_block('#email_error', 'Пользователь с таким email-ом уже существует');
                } 
            }
        }); 

    });

    email.keyup(function () {
        email_valid =  check_input(email, 'email', email_expression, '#email_error');
        unlock_signup_btn();
    });

    //Проверка пароля при регистрации
    reg_password.focus(function () {
        show_hint('#reg_password_hint');
    });

    reg_password.blur(function () {
        if ($(this).val().length < 6 && $(this).val().length != 0) {
            show_error_block('#reg_password_error', 'Данное поле должно содержать не менее 6 символов');
        }
        hide_hint('#reg_password_hint');
    });

    reg_password.keyup(function () {
        if ($(this).val() !==  reg_password_confirm.val() && reg_password_confirm.val()!= '') {
            show_error_block('#reg_password_error', 'Пароли не совпадают');
            return false;
        } 
        reg_password_valid = check_input(reg_password, 'text', password_expresion, '#reg_password_error');
        unlock_signup_btn();
    });

    //Подтверждение пароля
    reg_password_confirm.focus(function () {
        show_hint('#reg_password_confirm_hint');
    });

    reg_password_confirm.blur(function () {
        hide_hint('#reg_password_confirm_hint');
    });

    reg_password_confirm.keyup(function () {
        if ($(this).val() !==  reg_password.val()) {
            show_error_block('#reg_password_confirm_error', 'Пароли не совпадают');
            return false;
        } 
        reg_password_confirm_valid =  check_input(reg_password_confirm, 'text', password_expresion, '#reg_password_confirm_error');
        unlock_signup_btn();
    });

    //Проверка логина при авторизации
    auth_login.keyup(function () {
        if ($(this).val() != '') {
            auth_login_valid = true;
        } else {
            auth_login_valid = false;
        }
        unlock_signin_btn();
    });

    //Проверка пароля при авторизации
    auth_password.keyup(function () {
        if ($(this).val().length >= 6 ) {
            auth_password_valid = true;
        } else {
            auth_password_valid = false;
        }
        unlock_signin_btn();
    });

    //Покзать форму с восстановлением пароля
    $('#recover_password').click(function () {
        $('#recover_pass_form').css('left', '0');
    });

    //Скрыть форму с  восстановлением пароля
    $('#hide_form').click(function () {
        $('#recover_pass_form').css('left', '-100%');
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

    /* Восстановление пароля */

    //Отправка данных для восстановление пароля
    $('#recover_pass').click(function () {
        $(this).css('pointer-events', 'none');

        $.ajax({
            url: 'recover_password',
            type: 'POST',
            cache: false,
            dataType: 'html',
            data: {
                'login_confirm': $('#login_confirm').val(),
                'email_confirm': $('#email_confirm').val(),
                'token': $('#recover_token').val()
            },
            success: function (data) {
                response = JSON.parse(data);
                $('#recover_pass').css('pointer-events', 'all');
                if (response.status != 200) {
                    //Ошибка
                    if (response.status == 419) {
                        $('#recover_password_error').css('display', 'block');
                        $('#recover_password_error').text('Ошибка безопасности');
                    } else {
                        $('#recover_password_error').css('display', 'block');
                        $('#recover_password_error').text(response.message);
                    }
                } else {
                    //Все норм
                    $('#recover_password_error').css('display', 'none');
                    $('#success').html('Данные успешно изменены <br> Новый пароль отправлен вам на почту');
                }
            }
        });
    });  

    /*
    Показать блок с ошибкой
    block - id блока с ошибкой 
    text - текст ошибки
    */
    function show_error_block (block, text) {
        signup.addClass('disabled_btn');
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

    //Показать подсказку
    function show_hint(hint) {
        $(hint).css({
            'opacity': 1,
            'right': '-360px'
        });
    }

    //Скрыть подсказку
    function hide_hint(hint) {
        $(hint).css({
            'opacity': 0,
            'right': '-380px'
        });
    }

    /* Отправка данных */

    signup.click(reg);
    signin.click(auth);

    function unlock_signup_btn () {

        if (reg_login_valid && email_valid && reg_password_valid && reg_password_confirm_valid) {
            signup.removeClass('disabled_btn');
        }

    }
    function unlock_signin_btn () {

        if (auth_login_valid == true && auth_password_valid == true ) {
            signin.removeClass('disabled_btn');
        } else {
            signin.addClass('disabled_btn');
        }
    }

    function reg () {
        $.ajax({
            url: 'reg',
            type: 'POST',
            cache: false,
            dataType: 'html',
            data: {
                'login': reg_login.val(),
                'email': email.val(),
                'reg_password': reg_password.val(),
                'reg_password_confirm': reg_password_confirm.val(),
                'token': $('#reg_token').val()
            },
            beforeSend: function () {
                signup.addClass('disabled_btn');
                signin.addClass('disabled_btn');
            },
            success: function (data) {
                    
                response = JSON.parse(data);

                if (response.status != 200) {
                    // Есть какая-то ошибка 
                    if (response.status == 419) {
                        //Ошибка csrf
                        $('#reg_security_error').html('Ошибка безопасности');
                        $('#reg_security_error').css({
                            'width': '90%',
                            'padding': '5%',
                            'height': 'auto'
                        }); 
                    } else {
                        // Ошибка провереке данных из формы
                        show_error_block(response.error_block, response.message);
                    }
                } else {
                    // Ошибки нет
                    window.location.replace("profile");
                }
            }
        });
        return false;
    }

    function auth () {
        $.ajax({
            url: 'auth',
            type: 'POST',
            cache: false,
            dataType: 'html',
            data: {
                'login': auth_login.val(),
                'password': auth_password.val(),
                'token': $('#auth_token').val()
            },
            beforeSend: function () {
                signup.addClass('disabled_btn');
                signin.addClass('disabled_btn');
            },
            success: function (data) {
   
                response = JSON.parse(data);
                
                if (response.status != 200) {
                    //Ошибка с данными
                    $('#auth_error').text(response.message);
                    $('#auth_error').css({
                        'width': '90%',
                        'padding': '5%',
                        'height': 'auto'
                    }); 
                } else {
                    // Ошибки нет
                    window.location.replace("profile");
                }
            }
        });
        return false;
    }

});










