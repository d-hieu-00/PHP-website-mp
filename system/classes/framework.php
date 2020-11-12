<?php

class framework{
    public function view($folder, $viewName, $data = []){
        if(file_exists("../application/views/".$folder."/".$viewName.".php")){
            require_once "../application/views/".$folder."/".$viewName.".php";
        } else {
            echo "file not found: ".$viewName.".php";
        }
    }

    public function model($modelName){
        if(file_exists("../application/models/".$modelName.".php")){
            require_once "../application/models/".$modelName.".php";
            return new $modelName;
        } else {
            echo "file not found: ".$modelName.".php";
        }
    }
}