<?php

return [

	//Главная страница
	'' => [
		'controller' => 'main',
		'action' => 'index'
	],
	//Профиль
	'profile' => [
		'controller' => 'account',
		'action' => 'profile'
	],
	// Получить статистику за неделю
	'get_weekly_data' => [
		'controller' => 'ajax',
		'action' => 'get_weekly_data'
	],
	// Получить данные
	'get_total_data' => [
		'controller' => 'ajax',
		'action' => 'get_total_data'
	],
	// Регистрация
	'reg' => [
		'controller' => 'account',
		'action' => 'reg'
	],
	// Авторизация
	'auth' => [
		'controller' => 'account',
		'action' => 'auth'
	],
	// Выход
	'logout' => [
		'controller' => 'account',
		'action' => 'logout'
	],
	//Изменить данные о пользователе
	'update_user' => [
		'controller' => 'account',
		'action' => 'update_user'
	],
	// математика
	'math' => [
		'controller' => 'main',
		'action' => 'subject'
	],
	// Физика
	'phys' => [
		'controller' => 'main',
		'action' => 'subject'
	],
	// Избранное 
	'fav' => [
		'controller' => 'main',
		'action' => 'subject'
	],
	// Получить избранные формулы
	'get_fav' => [
		'controller' => 'ajax',
		'action' => 'get_fav'
	],
	// Добавить формулу в избранное
	'add_fav' => [
		'controller' => 'ajax',
		'action' => 'add_fav'
	],
	// Удалить из избранного
	'remove_fav' => [
		'controller' => 'ajax',
		'action' => 'remove_fav'
	],
	// Удалить все из избранного
	'remove_all' => [
		'controller' => 'ajax',
		'action' => 'remove_all'
	],
	//Обратная связь
	'feedback' => [
		'controller' => 'account',
		'action' => 'feedback'
	],
	'feedback' => [
		'controller' => 'account',
		'action' => 'feedback'
	],
	//Проверить наличие профиля с таким email или login
	'check_exists_user' => [
		'controller' => 'account',
		'action' => 'check_exists_user'
	],
	// Управление статусом email расылки
	'mailing' => [
		'controller' => 'account',
		'action' => 'mailing'
	],
	//Изучение
	'^learn\?theme=.+&sbj=.+' => [
		'controller' => 'account',
		'action' => 'learn'
	],
	//Изменить статистику после обучения
	'update_formuls' => [
		'controller' => 'account',
		'action' => 'update_formuls'
	],
	//Восстановить пароль
	'recover_password' => [
		'controller' => 'account',
		'action' => 'recover_password'
	],

];






