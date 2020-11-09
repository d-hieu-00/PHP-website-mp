<?php

class welcome{
    public function __construct(){
        echo "welcome";
    }

    public function index($Name = "NoName"){
        echo "<br> <strong>$Name</strong>";
    }
}
?>