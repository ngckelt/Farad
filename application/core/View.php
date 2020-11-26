<?php

namespace application\core; 

class View {

	public $path;
	public $route;
	public $layout = 'base';


	public function __construct($route) {
		$this->route = $route;
		$this->path = $route['controller'] . '/' . $route['action'];	
	}

	public function render_page($data = []) {

		if (!empty($data)) {
			extract($data);
		}
		
		if (file_exists('application/views/' . $this->path . '.php')) {
			ob_start();
			require 'application/views/' . $this->path . '.php';
			$content = ob_get_clean();

			require 'application/views/layouts/' . $this->layout . '.php';
		} else {
			self::error_code(404);			
		}
	}

	public static function error_code($code) {
		http_response_code($code);

		if (file_exists('application/views/errors/' . $code . '.php')) {
			require 'application/views/errors/' . $code . '.php';
			die();
		} 
	}

	public static function redirect($url) {
		header('location: ' . $url);
		die();
	}
}
















