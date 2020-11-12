<?php

class HomeControl extends framework{
    public function __construct(){
        $this->view("Home","index");
    }

    public function index($Name = "NoName"){
        //require "../application/views/login.php";
        echo "<br> <strong>$Name</strong>";
    }
}