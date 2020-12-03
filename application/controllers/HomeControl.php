<?php

class homeControl extends BaseController{

    public function index(){
        $this->view("home","index");
    }
    /**
     * 
     * get category
     */
    public function getCategory(){
        $response = array();
        $typeProductModel = $this->model('typeProductModel');
        $data = [];
        for ($i=1; $i<5; $i++){
            $data[] = $typeProductModel->getTypeProductByIdCategory($i);
        }
        echo json_encode($data);
    }
}