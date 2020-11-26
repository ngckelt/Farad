<?php

namespace application\controllers;

use application\core\Controller;
use application\core\View;


class MainController extends Controller {


	public function indexAction () {

		if (isset($_SESSION['login'])) {
			View::redirect('/profile');
		}

		$data = [
			'title' => 'Farad',
		];

		$this->view->render_page($data);
	}

	public function subjectAction () {

		function translate_title($title) {
			switch ($title) {
				case 'phys':
					return 'Физика';
				case 'math':
					return 'Математика';
				case 'fav':
					return 'Избранное';
			}
		}

		$title = translate_title(trim($_SERVER['REQUEST_URI'], '/'));
		$sbj = trim($_SERVER['REQUEST_URI'], '/');

		$data = [
			'title' => $title,
			'sbj' => $sbj,
			'login' => $_SESSION['login']
		];

		$this->view->render_page($data);

	}


}
















