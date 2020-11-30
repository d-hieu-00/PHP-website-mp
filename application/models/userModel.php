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
    public function checkActive(){
        $this->db->Query("select * from view_user where status='ACTIVE' and account=?", array($this->account));
        return $this->db->rowCount();
    }
    //return rows selected
    public function checkPhone(){
        $this->db->Query("select * from view_user where phone=?", array($this->phone));
        return $this->db->rowCount();
    }
    //return rows selected
    public function checkPassword(){
        $this->db->Query("select * from view_user where account=? and password=?", array($this->account, $this->password));
        return $this->db->rowCount();
    }

    public function updateLastAccess(){
        $this->db->Query("update mp_customer set 
                        date_last_access=SYSDATE() 
                        where id_user=?", 
            array($this->getIdUser($this->account)));
        return $this->db->rowCount();
    }
    
    //return User as object
    public function getUser($Account){
        $this->db->Query("select * from view_user where account=?", array($Account));
        $obj = $this->db->fetch();
        
        $this->account = $obj->account;
        $this->password = $obj->password;
        $this->fullName = $obj->fullName;
        $this->email = $obj->email;
        $this->phone = $obj->phone;
        $this->address = $obj->address;
        $this->city = $obj->city;
        $this->province = $obj->province;
    }
    public function getIdUser($Account){
        $this->db->Query("select * from view_user where account=?", array($Account));
        $obj = $this->db->fetch();
        return $obj->id;
    }
    //return rows update
    public function updateUser(){
        $this->db->Query("update mp_customer set full_name=?, email=?, address=?, city=?, province=? where id_user=?",
            array($this->fullName, $this->email, $this->address, $this->city, $this->province, $this->getIdUser($this->account)));
        return $this->db->rowCount();
    }
    //return rows update
    public function updatePassword($newPassword){
        $this->db->Query("update mp_user set password=? where account=?",
            array($newPassword, $this->account));
        return $this->db->rowCount();
    }
    public function getImg($Account){
        $this->db->Query("select img from mp_user where account=?",
            array($Account));
        return $this->db->fetch();
    }
    public function setImg($img){
        $this->db->Query("update mp_user set img=? where account=?",
            array($img, $this->account));
        return $this->db->rowCount();
    }
    public function deleteAccount(){
        $this->db->Query("update mp_customer set status='DISABLE' where id_user=?", 
            array($this->getIdUser($this->account)));
        return $this->db->rowCount();
    }
    public function activeAccount(){
        $this->db->Query("update mp_customer set status='ACTIVE' where id_user=?", 
            array($this->getIdUser($this->account)));
        return $this->db->rowCount();
    }
    public function getAll(){
        $this->db->Query("select * from view_user");
        return $this->db->fetchAll();
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