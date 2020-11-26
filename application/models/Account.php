<?php

namespace application\models;

use application\core\Model;

class Account extends Model {

	public function get_user_data($login) {
		$data = $this->db->fetch_one('SELECT * FROM `users` WHERE `login`=:login', ['login' => $login]);
		return $data;
	}

	public function get_rating () {
        $math = $this->db->fetch_all('SELECT `login`, `math` from `users` order by `math` desc limit 5');
        $phys = $this->db->fetch_all('SELECT `login`, `phys` from `users` order by `phys` desc limit 5');
        $total = $this->db->fetch_all('SELECT `login`, `total` from `users` order by `total` desc limit 5');
        return ['math' => $math, 'phys' => $phys, 'total' => $total];
	}

	public function sql($data, $table, $column, $value) {
		$result = $this->db->fetch_one("SELECT $data FROM $table WHERE $column = :value", ['value' => $value ] );
		return $result;
	}

	public function get_current_statistic ($sql, $args) {
		$data = $this->db->fetch_one($sql, $args);
		return $data;
	}

	public function insert ($sql, $args) {
		$this->db->query($sql, $args);
	}

	public function delete ($sql, $args) {
		$this->db->query($sql, $args);
	}

	public function feedback ($login, $email, $date, $message) {

		$this->db->query(
			'INSERT INTO `feedback`(`login`, `email`, `date`, `message`) VALUES (:login, :email, :date, :message)', 
			[
				'login'=> $login, 
				'email'=> $email, 
				'date'=> $date, 
				'message'=> $message
			]);
	}

	public function check_maling ($login) {
		$user_id = $this->db->fetch_one('SELECT `id` FROM `maling` WHERE `login` = :login', ['login' => $login ] );
		if ($user_id == false) {
			return false;
		} else {
			return true;
		}
	}

}






