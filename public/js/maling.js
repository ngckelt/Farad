
$('#maling_add').click(function () {
    $(this).css('pointer-events', 'none');
    $.ajax({
        url: 'mailing',
        type: 'POST',
        cache: false,
        data: { 'action': 'add' },
        success: function (data) {
            response = JSON.parse(data);
            if (response.status == 200) {
                //Все нормально
                $('.mail').html('Вы подписались на email рассылку. Отписаться можно в любой момент');
            } else {
                //Ошибка
                $('.mail').html('Произошла ошибка. Попробуйте позже');
            }
            $(this).css('pointer-events', 'all');
             
        }
    });
});


$('#maling_remove').click(function () {
    $(this).css('pointer-events', 'none');
    $.ajax({
        url: 'mailing',
        type: 'POST',
        cache: false,
        data: { 'action': 'remove' },
        success: function (data) {
            response = JSON.parse(data);
            if (response.status == 200) {
                //Все нормально
                $('.mail').html('Вы отписались от email рассылки. Подписаться можно в любой момент');
            } else {
                //Ошибка
                $('.mail').html('Произошла ошибка. Попробуйте позже');
            }
            $(this).css('pointer-events', 'all');
        }
    });
});

