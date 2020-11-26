<?php

namespace application\core;

use application\core\View;

abstract class Controller {

	public $curr_url; 
	public $view;
	public $model;

	public function __construct($args) {

		if (!password_verify(md5(bin2hex(str_rot13($_SERVER['HTTP_USER_AGENT'])) . '>Swoj,ou<FPE*EFUAO;9E;SO8ZVHY:iSD'), $_SESSION['ua'])) {
			session_destroy();
			View::redirect('/');
		}

		$this->curr_url = $args;
		$this->view = new View($args);
		$this->model = $this->load_model($args['controller']);
	}

	public function load_model($name) {
		$path = 'application\models\\' . ucfirst($name);
		if (class_exists($path)) {
			return new $path();
		}
	}

}


