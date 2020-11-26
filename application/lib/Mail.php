<?php

namespace application\lib;

class Mail  {

    private $sbj = '=?utf-8?B?Новое сообщение?=';
    
    public function send_mail($recipient, $message) {
        
        if (mail($recipient, $this->sbj, $message)) {
            return true;
        } else {
            return false;
        }

    }

}
