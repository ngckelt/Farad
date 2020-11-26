<?php

namespace application\lib;

class Validation {

    private $login_regex = '/[^a-z0-9_-]/i';
    private $password_regex = '/[^a-z0-9\_\-\#\,\*]/i';
    private $email_regex = '/^([a-zA-z0-9\_\-]+@[a-zA-Z0-9\.\-]+(\.[a-zA-Z0-9]+)+)*$/i';
    private $text_regex = '/[^\.,!?() a-zA-Z0-9А-Яа-я]/u';

    /* 
    $str - значение инпута
    */
    public function valid_text_input($str, $error_block = '') {

        if (preg_match($this->login_regex, $str) != 0) {
            return self::interrupt_script(400, 'Запрещенный символ', $error_block);
        } else if (mb_strlen($str) < 3) {
            return self::interrupt_script(400, 'Поле слишком короткое', $error_block);
        } else if (mb_strlen($str) >10) {
            return self::interrupt_script(400, 'Поле слишком длинное', $error_block);
        }

        return true;
    }

    /* 
    $str - значение инпута
    */
    public function valid_textarea ($str, $error_block = '') {

        if (preg_match($this->text_regex, $str) != 0) {
            return self::interrupt_script(400, 'Запрещенный символ', $error_block);
        } 

        return true;
    }

    /* 
    $str - значение инпута
    */
    public function valid_email_input($str, $error_block = '') {
        
        if (preg_match($this->email_regex, $str) == 0) {
            return self::interrupt_script(400, 'Email заполнен некорректно', $error_block);
        }

        return true;
    }

    /* 
    $str - значение инпута
    */
    public function valid_password_input($str, $error_block = '') {
        if (preg_match($this->password_regex, $str) != 0) {
            return self::interrupt_script(400, 'Запрещенный символ', $error_block);
        } else if (mb_strlen($str) < 6) {
            return self::interrupt_script(400, 'Поле слишком короткое', $error_block);
        }

        return true;
    }

    /* 
    $str - значение инпута
    */
    public function compare_inputs($str_1, $str_2, $error_block = '') {

        if ($str_1 != $str_2) {
            return self::interrupt_script(400, 'Пароли не совпадают', $error_block);
        }

        return true;
    }

    /*
    $status - http статус
    $message - описание ошибки
    $error_block - блок для отображения ошибки
    */
    public static function interrupt_script($status = 500, $message = '', $error_block = '') {
        echo json_encode( ['status' => $status , 'message' => $message, 'error_block' => $error_block] );
        die();
    }

}
