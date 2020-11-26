    <div class="forms">
        <div class="forms__nav row">
            <p id="auth">Авторизация</p>
            <p id="reg">Регистрация</p>
            <div id="forms__nav__line"></div>
        </div>

        <div id="reg_form">
            <form>
                <div class="input-wrapper">
                    <input type="text" id="reg_login" name="reg_login" required>
                    <label for="reg_login">Логин*</label>
                    <div class="hint" id="reg_login_hint">Данное поле должно содержать от 3 до 10 символов</div>
                    <div class="error__block" id="reg_login_error"></div>
                </div>
                <div class="input-wrapper">
                    <input type="text" id="email" name="email" required>
                    <label for="email">Email*</label>
                    <div class="hint" id="email_hint">Данное поле должно содержать ваш реальный email</div>
                    <div class="error__block" id="email_error"></div>
                </div>
                <div class="input-wrapper">
                    <input type="password" id="reg_password" name="reg_password" required>
                    <label for="reg_password">Пароль*</label>
                    <div class="hint" id="reg_password_hint">Данное поле должно содержать минимум 6 символов</div>
                    <div class="error__block" id="reg_password_error"></div>
                </div>
                <div class="input-wrapper">
                    <input type="password" id="reg_password_confirm" name="reg_password_confirm" required>
                    <label for="reg_password_confirm">Подтверждение пароля*</label>
                    <div class="hint" id="reg_password_confirm_hint">Данное поле должно содержать пароль, введенный выми ранее</div>
                    <div class="error__block" id="reg_password_confirm_error"></div>
                </div>
                <input type="hidden" id="reg_token" value="<?=create_token()?>">
                <a class="btn" id="signup_btn">Зарегестрироваться</a>
            </form>
            <p>Уже есть аккаунт? <span id="signin">Войти</span></p>
        </div>


        <div id="auth_form">
            <form>
                <div class="input-wrapper">
                    <input type="text" id="login" name="login" required>
                    <label for="login">Логин</label>
                </div>
                <div class="input-wrapper">
                    <input type="password" id="password" name="password" required>
                    <label for="password">Пароль</label>
                </div>
                <div id="auth_error">
                </div>
                <div class="security_error" id="auth_security_error"></div>
                <input type="hidden" id="auth_token" value="<?=create_token()?>">
                <a class="btn disabled_btn" id="signin_btn">Войти</a>
            </form>
            <p>Еще не аккаунта? <span id="signup">Зарегестрируйтесь!</span></p>
            <span id="recover_password">Забыли пароль?</span>
        </div>
    </div>