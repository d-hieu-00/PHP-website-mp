<?php

class welcome{
    public function __construct(){
        echo "welcome";
        
    }

    public function index($Name = "NoName"){
        //require "../application/views/login.php";
        echo "<br> <strong>$Name</strong>";
    }
}
?>