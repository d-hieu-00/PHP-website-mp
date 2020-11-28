<?php

class userModel{

    private $account, $password, $fullName, $email, $phone, $address, $city, $province;
    private $db;

    public function __construct(){
        $this->db = new database;
    }

    public function setData($Account, $Password, $FullName, $Email, $Phone, $Address, $City, $Province){
        $this->account = $Account;
        $this->password = $Password;
        $this->fullName = $FullName;
        $this->email = $Email;
        $this->phone = $Phone;
        $this->address = $Address;
        $this->city = $City;
        $this->province = $Province;
    }
    //return true or false
    public function signup(){
        return $this->db->Query("CALL createUser(?,?,?,?,?,?,?,?)", $this->toArray());
    }
    //return rows selected
    public function checkAccount(){
        $this->db->Query("select * from view_user where account=?", array($this->account));
        return $this->db->rowCount();
    }
    //return rows selected
    public function checkPhone(){
        $this->db->Query("select * from view_user where phone=?", array($this->phone));
        return $this->db->rowCount();
    }
    //return true or false
    public function checkPassword(){
        $this->db->Query("select * from view_user where account=? and password=?", array($this->account, $this->password));
        return $this->db->rowCount();
    }
    public function toArray(){
        return array(
            $this->account,
            $this->password,
            $this->fullName,
            $this->email,
            $this->phone,
            $this->address,
            $this->city,
            $this->province
        );
    }
}

?>