<?php

class database{
    public $host = HOST;
    public $user = USER;
    public $database = DATABASE;
    public $password = PASSWORD;
    public $con;
    public $result;

    public function __construct(){
        try{
            return $this->con = new PDO("mysql:host=".$this->host.";dbname=".$this->database,
                    $this->user, $this->password);
        } catch(PDOException $e){
            echo "Databsse connection Error: ".$e->getMessage();
        }
    }
 
    public function Query($query, $pargams = []){
        if(empty($pargams)){
            $this->result = $this->con->prepare($query);
            return $this->result->execute();
        } else {
            $this->result = $this->con->prepare($query);
            return $this->result->execute($pargams);
        }
    }
}


?>