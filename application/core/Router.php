<?php

namespace application\core; 
use application\core\View; 

class Router {

	protected $routes = []; 
	protected $params = []; 

	function __construct() {
		$urls = require 'application/config/routes.php';
		foreach ($urls as $route => $params) {
			$this->add_route($route, $params);
		}
	}

	public function add_route($route, $params) {
		$url = '#^' . $route . '$#'; 
		$this->routes[$url] = $params; 
	}

	public function route_exists () {
		$curr_url = trim($_SERVER['REQUEST_URI'], '/'); 
		foreach ($this->routes as $route => $params) {
			if (preg_match($route, $curr_url, $matches)) {
				$this->params = $params;
				return true;
			}	
		}
		return false;
	}

	public function run() {
		if ($this->route_exists()) { 
			$controller_path = 'application\controllers\\' . ucfirst($this->params['controller']) . 'Controller'; 	
			if (class_exists($controller_path)) {
				$action = $this->params['action'] . 'Action';
				if (method_exists($controller_path, $action) ) {
					$controller = new $controller_path($this->params); 
					$controller->$action(); 
				} else {
					View::error_code(404);
				}
			} else {
				View::error_code(404);	
			}
		} else {
			View::error_code(404);
		}
	}
}












