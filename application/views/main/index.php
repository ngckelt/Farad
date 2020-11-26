<link rel="stylesheet" href="public/css/home.css">
<link rel="stylesheet" href="public/css/main.css">
<div class="burger-wrapper">
        <div class="burger">
            <div class="line top-line"></div>
            <div class="line middle-line"></div>
            <div class="line bottom-line"></div>
        </div>
    </div>

    <aside>
        <h2 class="logo-wrapper">
            <img src="public/media/logo.svg" class="logo">
        </h2>

        <?php include_once 'application/views/templates/reg_auth_forms.php'; ?>
        <?php include_once 'application/views/templates/footer.php'; ?>
        <div id="recover_pass_form">
            <h2>Восстановление пароля</h2>
            <form>

                <div class="input-wrapper">
                    <input type="text" id="login_confirm" name="login_confirm" required>
                    <label for="login_confirm">Логин*</label>
                </div>

                <div class="input-wrapper">
                    <input type="text" id="email_confirm" name="email_confirm" required>
                    <label for="email_confirm">Email*</label>
                </div>
                <input type="hidden" id="recover_token" value="<?=create_token()?>">
                <div class="security_error" id="recover_security_error"></div>
            </form>

            <div id="recover_password_error"></div>
            <div id="success"></div>
            <a class="btn" id="recover_pass">Отправить</a>

            <a class="btn" id="hide_form">Назад</a>
        </div>
    </aside>

    <main>
        <div class="content">
            <div class="name">
                <h1>Farad</h1>
                <div class="description">
                    <p>Онлайн тренажер для запоминания формул по математике и физике</p>
                </div>
            </div>

            <div class="steps-wrapper">

                <div class="step">
                    <div class="step__content row">
                        <div class="icon-wrapper">
                            <i class="fas fa-user-plus"></i>
                        </div>
                        <div class="step__description">
                            <h3>Шаг 1</h3>
                            <p>Создание аккаунта</p>
                        </div>
                    </div>
                    <p>Это необходимо для просмотра статистики и добавления формул в избрнное</p>
                </div>

                <div class="step">
                    <div class="step__content row">
                        <div class="icon-wrapper">
                            <i class="fas fa-calendar-check"></i>
                        </div>
                        <div class="step__description">
                            <h3>Шаг 2</h3>
                            <p>Выбор формул</p>
                        </div>
                    </div>
                    <p>На выбор вам предоставлены все основные формулы по физике и математике за весь школьный курс </p>
                </div>

                <div class="step">
                    <div class="step__content row">
                        <div class="icon-wrapper">
                            <i class="fas fa-user-graduate"></i>
                        </div>
                        <div class="step__description">
                            <h3>Шаг 3</h3>
                            <p>Изучение</p>
                        </div>
                    </div>
                    <p>Вам необходимо собрать формулу из предоставленных элементов. Количество попыток - не ограничено</p>
                </div>


            </div>

            <div class="demo__btn-wrapper">
                <a href="learn?theme=none&sbj=demo" class="btn" id="demo">Попробовать демо</a>
            </div>

        </div>
    </main>


<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
<script src="public/js/index.js"></script>
<script src="public/js/home.js"></script>
<script src="public/js/valid_forms.js"></script>