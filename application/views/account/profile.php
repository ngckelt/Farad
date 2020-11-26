<link rel="stylesheet" href="public/css/home.css">
<link rel="stylesheet" href="public/css/aside.css">
<link rel="stylesheet" href="public/css/profile.css">
<?php

if (isset($_COOKIE['light_mode'])) {

    if ($_COOKIE['light_mode'] == 'true') {
        echo '<link id="color_mode" rel="stylesheet" href="public/css/light.css">';
    } else {
        echo ' <link id="color_mode" rel="stylesheet">';
    }
}

?>

<div class="burger-wrapper">
    <div class="burger">
        <div class="line top-line"></div>
        <div class="line middle-line"></div>
        <div class="line bottom-line"></div>
    </div>
</div>

<aside>
    <?php require 'application/views/templates/aside.php'; ?>
</aside>

<main>
    <div class="content-wrapper">

        <div class="wrapper info">
            <h2><i class="fas fa-signal"></i> Статистика</h2>
            <h4>Общее количество формул - <span class="note"> <?= $user_data['total'] ?> </span></h4>
            <h4>Количество формул по математике - <span class="note"><?= $user_data['math'] ?></span></h4>
            <h4>Количество формул по физике - <span class="note"><?= $user_data['phys'] ?></span> </h4>
        </div>

        <?php

        if (isset($_COOKIE['new_data'])) {
            if ($_COOKIE['new_data'] == 'True') {
                echo '<div class="wrapper session__data">';
                echo '<h2>Данные за последний сеанс</h2>';
                echo '<h4>Длительность сеанса - <span class="note">' . $_COOKIE['session_time'] . '</span></h4>';
                echo '<h4>Общее количество формул - <span class="note">' .  $_COOKIE['total'] . '</span></h4>';
                echo '<h4>Количество формул, решенных с первой попытки - <span class="note">' .  $_COOKIE['first_attempt'] . '</span></h4>';
                echo '<h4>Количество формул, решенных со второй попытки - <span class="note">' . $_COOKIE['second_attempt'] . '</span></h4>';
                echo '<h4>Количество формул, решенных с третьей попытки - <span class="note">' . $_COOKIE['third_attempt'] . '</span></h4>';
                echo '<h4>Количество формул, решенных с четвертой или более попыток - <span class="note">' . $_COOKIE['greater_attempt'] . '</span></h4>';
                echo '</div>';
            }
        }

        ?>

        <div class="wrapper">
            <h2>Общее количество формул за неделю - <span class="note" id="week_total"></span> </h2>
            <canvas id="weekly_chart"></canvas>
        </div>

        <div class="wrapper">
            <h2>Количество формул с учетом данных всех пользователей</h2>
            <canvas id="total_chart"></canvas>
        </div>

        <div class="wrapper">
            <div id="update_form">
                <h2 class="update_title">Изменить данные о профиле</h2>
                    <form>
                        <div class="input-wrapper">
                            <input type="text" id="login" name="login" value="<?= $user_data['login'] ?>" required>
                            <label for="login">Логин</label>
                            <div class="error__block" id="login_error"></div>
                        </div>
                        <div class="input-wrapper">
                            <input type="text" id="email" name="email" value="<?= $user_data['email'] ?>" required>
                            <label for="email">Email</label>
                            <div class="error__block" id="email_error"></div>
                        </div>
                        <div class="input-wrapper">
                            <input type="password" id="new_password" name="new_password" required>
                            <label for="new_password">Новый пароль</label>
                            <div class="error__block" id="new_password_error"></div>
                        </div>
                        <div class="input-wrapper">
                            <input type="password" id="new_password_confirm" name="new_password_confirm" required>
                            <label for="new_password_confirm">Подтверждение пароля</label>
                            <div class="error__block" id="new_password_confirm_error"></div>
                        </div>
                        <div class="input-wrapper">
                            <input type="password" id="current_password" name="current_password" required>
                            <label for="current_password">Текущий пароль*</label>
                            <div class="error__block" id="current_password_error"></div>
                        </div>
                        <input type="hidden" id="update_token" value="<?=create_token()?>">
                        <a class="btn" id="update_btn">Изменить</a>
                    </form>
            </div>
        </div>

        <div class="wrapper mail">
            <div class="row">
                <h3>Email рассылка</h3>
                <?php
                if ($maling) {
                    echo '<a class="btn" id="maling_remove">Отписаться</a>';
                } else {
                    echo '<a class="btn" id="maling_add">Подписаться</a>';
                }
                ?>

            </div>
        </div>

        <div class="wrapper feedback">
            <h3>Обратная связь</h3>
            <p>Если у вас есть какие-либо вопросы вы всегда можете связаться со мной</p>
            <form>
                <textarea name="message" id="message" cols="30" rows="10" required></textarea>
                <label for="message">Оставить сообщение</label>
            </form>
            <div id="message__alert">
            </div>
            <input type="hidden" id="mail_token" value="<?=create_token()?>">
            <div class="security_error" id="mail_security_error"></div>
            <a class="btn" id="submit">Отправить</a>
        </div>
    </div>

    <div class="rating-outher">
        <div class="rating-wrapper">

            <div class="wrapper">
                <h2> <i class="fas fa-crown"></i> Рейтинг пользователей</h2>
            </div>

            <div class="wrapper">
                <div class="rating__title">
                    <h2>Общее количество формул</h2>
                </div>
                <div class="rating__content">
                    <?php
                    for ($a = 0, $b = 1; $a < 5; $a++, $b++) {
                        if (isset($rating['total'][$a]['login'])) {
                            if ($rating['total'][$a]['login'] == $_SESSION['login']) {
                                echo '<h3 class="note">' . $b . '. ' . $rating['total'][$a]['login'] . ' - ' . $rating['total'][$a]['total'] . '</h3>';
                            } else {
                                echo '<h3>' . $b . '. ' . $rating['total'][$a]['login'] . ' - ' . $rating['total'][$a]['total'] . '</h3>';
                            }
                        }
                    }
                    ?>
                </div>
            </div>
            <div class="wrapper">
                <div class="rating__title">
                    <h2>Физика</h2>
                </div>
                <div class="rating__content">
                    <?php
                    for ($a = 0, $b = 1; $a < 5; $a++, $b++) {
                        if (isset($rating['phys'][$a]['login'])) {
                            if ($rating['phys'][$a]['login'] == $_SESSION['login']) {
                                echo '<h3 class="note">' . $b . '. ' . $rating['phys'][$a]['login'] . ' - ' . $rating['phys'][$a]['phys'] . '</h3>';
                            } else {
                                echo '<h3>' . $b . '. ' . $rating['phys'][$a]['login'] . ' - ' . $rating['phys'][$a]['phys'] . '</h3>';
                            }
                        }
                    }

                    ?>
                </div>
            </div>
            <div class="wrapper">
                <div class="rating__title">
                    <h2>Математика</h2>
                </div>
                <div class="rating__content">
                    <?php
                    for ($a = 0, $b = 1; $a < 5; $a++, $b++) {
                        if (isset($rating['math'][$a]['login'])) {
                            if ($rating['math'][$a]['login'] == $_SESSION['login']) {
                                echo '<h3 class="note">' . $b . '. ' . $rating['math'][$a]['login'] . ' - ' . $rating['math'][$a]['math'] . '</h3>';
                            } else {
                                echo '<h3>' . $b . '. ' . $rating['math'][$a]['login'] . ' - ' . $rating['math'][$a]['math'] . '</h3>';
                            }
                        }
                    }
                    ?>
                </div>
            </div>
        </div>
    </div>

</main>




<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js"></script>
<script src="public/js/index.js"></script>
<script src="public/js/profile.js"></script>
<script src="public/js/maling.js"></script>
<script src="public/js/update.js"></script>