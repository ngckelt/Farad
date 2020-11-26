<?php

namespace application\controllers; 

use application\core\Controller; 
use application\core\View;
use application\lib\Validation; 
use application\lib\Mail;
use Exception;

class AccountController extends Controller {

	private $valid;
	private $mail;

	function __construct($args) {
		parent::__construct($args);
		$this->valid = new Validation;
		$this->mail = new Mail;
	}

	public function profileAction() {

		check_session();

		$user_data = $this->model->get_user_data($_SESSION['login']);
		$rating = $this->model->get_rating();
		$maling = $this->model->check_maling($_SESSION['login']);

		$data = [
			'title' => 'Профиль',
			'user_data' => $user_data,
			'rating' => $rating,
			'login' => $_SESSION['login'],
			'maling' => $maling
		];

		$this->view->render_page($data);
	}

	public function authAction() {

		check_token();

		$login = trim(filter_var(strip_tags($_POST['login']), FILTER_SANITIZE_STRING));
		
		$password = trim(filter_var(strip_tags($_POST['password']), FILTER_SANITIZE_STRING));

		//Проверка логина
		$this->valid->valid_text_input($login);

		//Проверка пароля
		$this->valid->valid_password_input($password);

		$user_data = $this->model->get_user_data($login);

		if ($user_data == False) {
			Validation::interrupt_script(400, 'Неверный логин или пароль');
		}

		$password = str_rot13(md5(bin2hex(str_rot13($password)) . "_}%Trtu7T^__^&??;=+;[]:{}W]\||\OK:ml;ewk'"));

		if (!password_verify($password, $user_data['password'])) {
			Validation::interrupt_script(400, 'Неверный логин или пароль');
		}

		$_SESSION['login'] = $login;

		Validation::interrupt_script(200, 'success');
	}

	public function regAction() {

		check_token();

		// Данные из массива POST
		$login = trim(filter_var(strip_tags($_POST['login']), FILTER_SANITIZE_STRING));
		$email = trim(filter_var(strip_tags($_POST['email']), FILTER_SANITIZE_EMAIL));
		$password = trim(filter_var(strip_tags($_POST['reg_password']), FILTER_SANITIZE_STRING));
		$password_confirm = trim(filter_var(strip_tags($_POST['reg_password_confirm']), FILTER_SANITIZE_STRING));

		//Проверка логина
		$this->valid->valid_text_input($login, '#reg_login_error'); //  '#reg_login_error'

		//Проверка почты
		//Проверка на временный email
		//require 'check_mail.php';
		$this->valid->valid_email_input($email, '#email_error'); // '#email_error'

		//Первый пароль
		$this->valid->valid_password_input($password, '#reg_password_error'); // '#reg_password_error'

		//Второй пароль
		$this->valid->valid_password_input($password_confirm, '#reg_password_confirm_error'); // '#reg_password_confirm_error'

		//Совпадение паролей
		$this->valid->compare_inputs($password_confirm, $password, '#reg_password_confirm_error'); // '#reg_password_confirm_error'


		// Проверка пользователя с таким же логином
		$user_data = $this->model->sql('id', 'users', 'login', $login);

		if ($user_data != false) {
			Validation::interrupt_script(400, 'Пользователь с таким логином уже существует', '#reg_login_error');
		}

		// Проверка пользователя с таким же email
		$user_data = $this->model->sql('id', 'users', 'email', $email);
		if ($user_data != false) {
			Validation::interrupt_script(400, 'Пользователь с таким email уже существует', '#email_error');
		}

		//Хэширование пароля
		
		$password = password_hash(str_rot13(md5(bin2hex(str_rot13($password)) . "_}%Trtu7T^__^&??;=+;[]:{}W]\||\OK:ml;ewk'")), PASSWORD_BCRYPT);

		// Добавить запись в бд
		try {

			$this->model->insert(
				'INSERT INTO `users`(`login`, `email`, `password`, `reg_date`) VALUES (:login, :email, :password, :reg_date)',
				[
					'login' => $login,
					'email' => $email,
					'password' => $password,
					'reg_date' =>  date('Y-m-d H:i:s')
				]
			);

			$this->model->insert('INSERT INTO `weekly_statistics`(`login`) VALUES (:login)', ['login' => $login]);

			$_SESSION['login'] = $login;

			Validation::interrupt_script(200);
		} catch (Exception $e) {
			Validation::interrupt_script(500, 'Ошибка при добавлении данных', '#reg_security_error');
		}
	}

	// Изменение данных о текущем пользователе
	public function update_userAction() {

		check_token();

		$new_login = trim(filter_var(strip_tags($_POST['login']), FILTER_SANITIZE_STRING));
		$new_email = trim(filter_var(strip_tags($_POST['email']), FILTER_SANITIZE_STRING));
		$current_password = trim(filter_var(strip_tags($_POST['current_password']), FILTER_SANITIZE_STRING));
		$new_password = trim(filter_var(strip_tags($_POST['new_password']), FILTER_SANITIZE_STRING));
		$new_password_confirm = trim(filter_var(strip_tags($_POST['new_password_confirm']), FILTER_SANITIZE_STRING));


		$current_password = str_rot13(md5(bin2hex(str_rot13($current_password)) . "_}%Trtu7T^__^&??;=+;[]:{}W]\||\OK:ml;ewk'"));

		$user_data = $this->model->get_user_data($_SESSION['login']);

		//Проверка текущего пароля
		if (!password_verify($current_password, $user_data['password'])) {
			Validation::interrupt_script(400, 'Неверный пароль', '#current_password_error');
		} 

		//Проверка логина
		if (mb_strlen($new_login) != 0) {
			$this->valid->valid_text_input($new_login, '#login_error');
		}

		//Проверка почты
		if (mb_strlen($new_email) != 0) {
			$email = $new_email;
			$this->valid->valid_email_input($new_email, '#email_error');
		}

		//Первый пароль
		if (mb_strlen($new_password) != 0) {
			$this->valid->valid_password_input($new_password, '#new_password_error');
		}

		//Сравнение паролей
		if (mb_strlen($new_password_confirm) != 0) {
			$this->valid->compare_inputs($new_password, $new_password_confirm, '#new_password_confirm_error');
		}

		if ($new_login != $user_data['login']) {

			$user_id = $this->model->db->fetch_one('SELECT `id` FROM `users` WHERE `login` = :login',  ['login' => $new_login]);

			if ($user_id != false) {
				Validation::interrupt_script(400, 'Пользователь с таким логином уже существует', '#login_error');
			}
		}

		if ($new_email != $user_data['email']) {
			$user_id = $this->model->db->fetch_one('SELECT `id` FROM `users` WHERE `email` = :email',  ['email' => $new_email]);

			if ($user_id != false) {
				Validation::interrupt_script(400, 'Пользователь с таким email уже существует', '#email_error');
			}
		}

		if (mb_strlen($new_password) != 0) {
			$password = password_hash(str_rot13(md5(bin2hex(str_rot13($new_password)) . "_}%Trtu7T^__^&??;=+;[]:{}W]\||\OK:ml;ewk'")), PASSWORD_BCRYPT);
		} else {
			$password = $user_data['password'];
		}

		$user_id = $this->model->db->query("UPDATE `users` SET `login`=:new_login, `email`=:email, `password`=:password  WHERE `login` = :login",  ['login' => $_SESSION['login'], 'new_login' => $new_login, 'email' => $new_email, 'password' => $password]);


		if ($new_login != $user_data['login']) {
			$_SESSION['login'] = $new_login;
		} 

		Validation::interrupt_script(200);
	}

	public function logoutAction() {
		session_destroy();
		foreach($_COOKIE as $cookie => $value) {
			setcookie($cookie, '', time() - 3600, '/');
		}
		View::redirect('/');
	}


	public function feedbackAction() {

		check_token();

		$message = trim(filter_var(strip_tags($_POST['message']), FILTER_SANITIZE_STRING));

		$this->valid->valid_textarea($message, '#message__alert');

		if (mb_strlen($message) < 15) {
			Validation::interrupt_script(500, 'Сообщение слишком короткое');
		}

		$user_data = $this->model->get_user_data($_SESSION['login']);

		$this->model->feedback($_SESSION['login'], $user_data['email'], date('Y-m-d H:i:s'), json_encode($message));

		if ($this->mail->send_mail('kamarinskiv@mail.ru', $message)) {
			Validation::interrupt_script(200, 'Сообщение успешно отправлено!');
		} else {
			Validation::interrupt_script(500, 'При отправке сообщения произошла ошибка');
		}
	}

	public function check_exists_userAction() {

		$field = trim(filter_var(strip_tags($_POST['field']), FILTER_SANITIZE_STRING));
		$val = trim(filter_var(strip_tags($_POST['data']), FILTER_SANITIZE_STRING));

		if ($field == 'login') {
			$this->valid->valid_text_input($val, '#reg_login_error');
		} else if ($field == 'email') {
			$this->valid->valid_email_input($val, '#email_error');
		} else {
			Validation::interrupt_script(400);
		}

		$user_data = $this->model->sql('id', 'users', $field, $val);

		if ($user_data != false) {
			Validation::interrupt_script(401);
		}

		Validation::interrupt_script(200);
	}

	public function mailingAction() {

		$action = trim(strip_tags($_POST['action']));

		$user = $this->model->get_user_data($_SESSION['login']);

		if ($action == 'add') {
			$this->model->insert('INSERT INTO `maling`(`login`, `email`) VALUES (:login, :email)',  ['login' => $user['login'], 'email' => $user['email']]);
		} else if ($action == 'remove') {
			$this->model->delete('DELETE FROM `maling` WHERE `login` = :login', ['login' => $user['login']]);
		} else {
			Validation::interrupt_script(400);
		}

		Validation::interrupt_script(200);
	}

	public function learnAction() {

		if (!isset($_SESSION['login']) && $_GET['sbj'] != 'demo') {
			View::redirect('/');
		}

		$data = [
			'title' => 'Изучение',
		];

		$this->view->render_page($data);
	}

	public function update_formulsAction() {
		$math_num = $_POST['math_count'];
		$phys_num = $_POST['phys_count'];

		//Извлечение данных
		$data = $this->model->get_current_statistic('SELECT `math`, `phys`, `total` FROM `users` WHERE `login` = :login', ['login' => $_SESSION['login']]);

		$current_math = $data['math'];
		$current_phys = $data['phys'];

		$new_math = $math_num + $current_math;
		$new_phys = $phys_num + $current_phys;
		$new_total = $data['total'] + $math_num + $phys_num;

		//Установка данных в таблицу с пользователями
		$this->model->insert("UPDATE `users` SET `math`=:math, `phys`=:phys, `total`=:total  WHERE `login` = :login", ['login' => $_SESSION['login'], 'math' => $new_math, 'phys' => $new_phys, 'total' => $new_total]);
		//Установка данных в таблицу с недельной статистикой

		$day = mb_strtolower(substr(date('l'), 0, 3));

		$this->model->insert("UPDATE `weekly_statistics` SET `$day` = `$day` + :total WHERE `login` = :login", ['login' => $_SESSION['login'], 'total' => $math_num + $phys_num]);

		Validation::interrupt_script(200);
	}

	public function recover_passwordAction () {

		check_token();

		$login = trim(filter_var(strip_tags($_POST['login_confirm']), FILTER_SANITIZE_STRING));
		$email = trim(filter_var(strip_tags($_POST['email_confirm']), FILTER_SANITIZE_STRING));

		$this->valid->valid_text_input($login, '#recover_password_error'); 
		$this->valid->valid_email_input($email, '#recover_password_error');

		$user_id = $this->model->db->fetch_one('SELECT `id` FROM `users` WHERE `login` = :login AND `email`= :email',  ['login' => $login, 'email' => $email]);

		if ($user_id == false) {
			Validation::interrupt_script(400, 'Пользователя с таким логином и email не существует');	
		}

		$alphabet = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789_-#,*';
		$new_pass = '';
		$max = mb_strlen($alphabet);
		for ($i = 0; $i < 8; $i++) {
			$new_pass .= $alphabet[rand(0, $max)];
		}

		try {
			$mail = new Mail;
			$mail->send_mail($email, "Новый пароль - $new_pass");
		} catch ( Exception $e ) {
			Validation::interrupt_script(500, 'При о тправке данных произошла ошибка');
		}

		$new_password = password_hash(str_rot13(md5(bin2hex(str_rot13($new_pass)) . "_}%Trtu7T^__^&??;=+;[]:{}W]\||\OK:ml;ewk'")), PASSWORD_BCRYPT);
		$this->model->insert("UPDATE `users` SET `password` = :new_password WHERE `login` = :login", ['login' => $login, 'new_password' => $new_password]);

		Validation::interrupt_script(200);

	}
}




