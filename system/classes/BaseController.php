<?php

class BaseController{
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
    public function input($inputName){
        if($_SERVER['REQUEST_METHOD'] == "POST" || $_SERVER['REQUEST_METHOD'] == 'post'){
            return trim(strip_tags($_POST[$inputName]));
        } else if($_SERVER['REQUEST_METHOD'] == 'GET' || $_SERVER['REQUEST_METHOD'] == 'get'){
            return trim(strip_tags($_GET[$inputName]));
        }
    }
    // Set session
   public function setSession($sessionName, $sessionValue){
        if(isset($sessionName) && isset($sessionValue)){
            $_SESSION[$sessionName] = $sessionValue;
        }
    }

    // Get session
    public function getSession($sessionName){
        if(isset($_SESSION[$sessionName])){
            return $_SESSION[$sessionName];
        }
    }
    // Unset session
    public function unsetSession($sessionName){
        if(isset($sessionName)){
            unset($_SESSION[$sessionName]);
        }
    }
    // Destroy whole sessions
    public function destroy(){
        session_destroy();
    }
    // Set flash message
    public function setFlash($sessionName, $msg){
        if(!empty($sessionName) && !empty($msg)){
            $_SESSION[$sessionName] = $msg;
        }
    }

    //Show flash message
    public function flash($sessionName, $className){
        if(!empty($sessionName) && !empty($className) && isset($_SESSION[$sessionName])){
            $msg = $_SESSION[$sessionName];
            echo "<div class='". $className ."'>".$msg."</div>";
            unset($_SESSION[$sessionName]);
        }
    }

    public function redirect($path){
        header("location:" . BASEURL . "/".$path);
    }
}