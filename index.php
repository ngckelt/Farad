<?php

use application\core\Router; 

spl_autoload_register( function ($class)  {
	$path = str_replace('\\', '/', $class . '.php');
	if (file_exists($path)) {
		require $path;
	}
});

session_start();

if (!isset($_SESSION['ua'])) {
    $_SESSION['ua'] =  password_hash(md5(bin2hex(str_rot13($_SERVER['HTTP_USER_AGENT'])) . '>Swoj,ou<FPE*EFUAO;9E;SO8ZVHY:iSD'), PASSWORD_BCRYPT);
}

function create_token() {

    if (!isset($_SESSION['token'])) {
        $token = str_rot13(md5(bin2hex(uniqid(rand(), true)) . $_SERVER['HTTP_USER_AGENT'] . time()));
        $_SESSION['token'] = $token;
    }

    return password_hash($_SESSION['token'], PASSWORD_DEFAULT);
}

function check_token () {
    $token = $_POST['token'] ?? '';
    if (!password_verify($_SESSION['token'], $token)) {
        session_destroy();
        die(json_encode(['status' => 419]));
    }
}

function check_session () {
    if (!isset($_SESSION['login'])) {
        session_destroy();
        header('Location: /');
    }
}

$router = new Router();
$router->run();



