<?php

class homeControl extends BaseController{

    public function index(){
        $this->view("home","index");
    }
}