<?php

namespace application\models;

use application\core\Model;

class Ajax extends Model {

	public function get_weekly_data ($login) {
		$data = $this->db->fetch_one('SELECT * FROM `weekly_statistics` WHERE `login` = :login', ['login' => $login]);
		$total = $this->db->fetch_one('SELECT `mon` + `tue` + `wed` + `thu` + `fri` + `sat` + `sun` AS `total` FROM `weekly_statistics` WHERE `login` = :login', ['login' => $login]);
		$data += $total;
		return $data;
	}


	public function get_total_data () {
        $data = $this->db->fetch_one('SELECT SUM(`math`) as sum_math, SUM(`phys`) as sum_phys, SUM(`total`) as sum_total FROM `users`');
        return $data;
	}

	public function get_fav ($login) {
		$data = $this->db->fetch_one('SELECT `fav` FROM `users` WHERE `login` = :login', ['login' => $login]);
        return $data;
	}

	public function add_fav ($login, $formula_id) {
		$this->db->query('UPDATE `users` SET `fav` = CONCAT(`fav`, :formula_id) WHERE `login` = :login ', ['formula_id'=>$formula_id, 'login'=> $login]);
	}

	public function remove_fav($login, $new_formuls) {
		$this->db->query('UPDATE `users` SET `fav` = :new_formuls WHERE `login` = :login', ['new_formuls'=>$new_formuls, 'login'=> $login]);
	}

	public function remove_all ($login) {
		$this->db->query('UPDATE `users` SET `fav` = "000" WHERE `login` = :login', ['login'=> $login]);
	}

}






