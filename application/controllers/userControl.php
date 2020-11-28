<?php

class userControl extends BaseController{
    public function __construct(){

        // if($this->getSession('userId')){
        //     $this->redirect("profile");
        // }
        $this->userModel = $this->model('userModel');
    }
    public function signup(){
        $this->view("user","signup");
    }
    public function login(){
        if($this->getSession('Account')){
            $this->redirect("/user/profile");
        } else {
            $this->view("user","login");
        }
    }
    public function profile(){
        if($this->getSession('Account')){
            $this->view("user","profile");
        } else {
            $this->redirect("/user/login");
        }
    }
    public function logout(){
        $this->unsetSession('Account');
        $this->view("user","login",array("msg" => "Bạn đã đăng xuất thành công"));
    }
    public function createAccount(){
        $response = array();
        $userData = [
            'Account' => $this->input('Account'),
            'Password' => $this->input('Password'),
            'FullName' => $this->input('FullName'),
            'Email' => $this->input('Email'),
            'Phone' => $this->input('Phone'),
            'Address' => $this->input('Address'),
            'City' => $this->input('City'),
            'Province' => $this->input('Province'),
        ];
        $this->userModel->setData(
            $userData['Account'],
            $userData['Password'],
            $userData['FullName'],
            $userData['Email'],
            $userData['Phone'],
            $userData['Address'],
            $userData['City'],
            $userData['Province']
        );
        $response['status'] = $this->userModel->signup($userData);
        if($response['status'] == false){
            if($this->userModel->checkAccount() > 0){
                $response['AccountError'] = "Tài khoản đã tồn tại";
            }
            if($this->userModel->checkPhone() > 0){
                $response['PhoneError'] = "Số điện thoại đã được sử dụng cho tài khoản khác";
            }
        }
        echo json_encode($response);
    }

    public function loginAccount(){
        $response = array();
        $userData = [
            'Account' => $this->input('Account'),
            'Password' => $this->input('Password'),
            'FullName' => "",
            'Email' => "",
            'Phone' => "",
            'Address' => "",
            'City' => "",
            'Province' => "",
        ];
        $this->userModel->setData(
            $userData['Account'],
            $userData['Password'],
            $userData['FullName'],
            $userData['Email'],
            $userData['Phone'],
            $userData['Address'],
            $userData['City'],
            $userData['Province']
        );
        if($this->userModel->checkAccount() < 1){
            $response['AccountError'] = "Tài khoản không tồn tại";
        } else {
            if($this->userModel->checkPassword() < 1){
                $response['PasswordError'] = "Sai mật khẩu";
                $response['status'] = false;
            } else {
                $response['status'] = true;
                $this->setSession('Account', $userData['Account']);
            }
        }
        echo json_encode($response);
    }
}





?>