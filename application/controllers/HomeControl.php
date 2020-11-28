<?php

class HomeControl extends BaseController{

    public function index(){
        $this->view("home","index");
    }
}