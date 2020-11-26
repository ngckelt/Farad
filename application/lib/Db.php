<?php

namespace application\lib;

use PDO;

class Db {

	private $pdo;

	function __construct () {
		$connection = require 'application/config/db_connect.php';
		$this->pdo = new PDO( 'mysql:host=' . $connection['host'] . ';dbname=' . $connection['db'] . '', $connection['user'], $connection['password'] );
	}

	public function query($sql, $args = []) {
		$query = $this->pdo->prepare($sql);
		$query->execute($args);
		return $query;
	}

	public function fetch_all($sql, $args = []) {
		$query = $this->query($sql, $args);
		$result = $query->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}

	public function fetch_one($sql, $args = []) {
		$query = $this->query($sql, $args);
		$result = $query->fetch(PDO::FETCH_ASSOC);
		return $result;
	}
	
}












