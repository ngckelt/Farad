<?php

namespace application\controllers;

use application\core\Controller;


class AjaxController extends Controller {

	public function get_weekly_dataAction () {
		$weekley_data = $this->model->get_weekly_data($_SESSION['login']);
		echo json_encode($weekley_data);
		die();
	}

	public function get_total_dataAction () {
		$total_data = $this->model->get_total_data();
		echo json_encode($total_data);
		die();
	}

	public function get_favAction () {
			$data = $this->model->get_fav($_SESSION['login']);
			die($data['fav']);
	}

	public function add_favAction () {
		$formula_id = trim(filter_var($_POST['formula_id'], FILTER_SANITIZE_STRING));
		$this->model->add_fav($_SESSION['login'], $formula_id);
		die();
	}

	public function remove_favAction () {
		$formula_id = trim(filter_var($_POST['formula_id'], FILTER_SANITIZE_STRING));
		$data = $this->model->get_fav($_SESSION['login']);
		$formuls = $data['fav'];
		$new_formuls = array();
		for ($a = 0, $b =  strlen($formuls); $a < $b; $a+=3) {
			$temp = array();
			array_push($temp, $formuls[$a], $formuls[$a+1], $formuls[$a+2]);
			array_push($new_formuls, implode("", $temp));
		}
		foreach($new_formuls as $key => $item){
			if ($item === $formula_id){
				unset($new_formuls[$key]);
			}
		}
		$new_formuls = implode('', $new_formuls);
		$this->model->remove_fav($_SESSION['login'], $new_formuls);
		die();
	}

	public function remove_allAction () {
		$this->model->remove_all($_SESSION['login']);
		die( json_encode(['status' => 200]) );
	}

}


