<?php


class adminControl extends BaseController{

    public function index(){
        if($this->getSession('Admin')){
            $this->view("admin","index");
        } else {
            $this->redirect('admin/login');
        }
    }
    public function login()
    {   
        if(isset($_POST['Password'])){
            if(PASSWORDADMIN == $this->input('Password')){
                $this->setSession('Admin',true);
                $this->redirect('admin');
            } else {
                $this->view("admin","login",array('msg' => 'Sai mật khẩu'));
            }    
        } else if($this->getSession('Admin')){
            $this->redirect('admin');
        } else {
            $this->view("admin","login");
        }
    }
    public function logout(){
        $this->unsetSession('Admin');
    }
}