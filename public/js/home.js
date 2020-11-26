$(document).ready(function () {

    /* Смещение линии и отображение необходимой формы */

    var form_line = $('#forms__nav__line');
    var reg = $('#reg');
    var auth = $('#auth');
    var reg_form = $('#reg_form');
    var auth_form = $('#auth_form');
    var signup = $('#signup');
    var signin = $('#signin');

    form_line.css('width', auth.width() + 'px');

    reg.click(function () {
        change_line_pos('reg');
        chenge_form('reg');
    });

    signup.click(function () {
        change_line_pos('reg');
        chenge_form('reg');
    });
    
    auth.click(function () {
        change_line_pos('auth');
        chenge_form('auth');
    });

    signin.click(function () {
        change_line_pos('auth');
        chenge_form('auth');
    });

    function change_line_pos (move_to) {
        if (move_to == 'reg') {
            form_line.css({
                'left': reg.position().left + 'px',
                'width': reg.width() + 'px'
            });
        } else {
            form_line.css({
                'left': auth.position().left + 'px',
                'width': auth.width() + 'px'
            });
        }
    }

    function chenge_form (form_to_show) {
        if (form_to_show == 'reg') {
            auth_form.css({
                'left': '70px',
                'opacity': 0,
                'pointer-events': 'none'
            });
            reg_form.css({
                'left': '0',
                'opacity': 1,
                'pointer-events': 'all'
            });
        } else {
            auth_form.css({
                'left': '0',
                'opacity': 1,
                'pointer-events': 'all'
            });
            reg_form.css({
                'left': '-70px',
                'opacity': 0,
                'pointer-events': 'none'
            });
        }
    }


});












