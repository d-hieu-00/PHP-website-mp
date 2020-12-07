<?php

class homeControl extends BaseController
{

    public function index()
    {
        $this->view("home", "index");
    }
    /**
     * 
     * get category
     */
    public function getCategory()
    {
        $response = array();
        $typeProductModel = $this->model('typeProductModel');
        $data = [];
        for ($i = 1; $i < 5; $i++) {
            $data[] = $typeProductModel->getTypeProductByIdCategory($i);
        }
        echo json_encode($data);
    }
    public function getAllProduct(){
        $productModel = $this->model('productModel');
        $allProduct = $productModel->getAll();
        $data = [];
        foreach ($allProduct as $val) {
            $row = '<div class="col p-0"><div class="border m-1">';
            $row.='<div class="hovereffect">';
            $row.='<a href="'.BASEURL.'/home/infoProduct/'.$val->id.'">';
            $row.='<img id="img" class="img-fluid" src="'.$val->img.'">';
            $row.='</a></div>';
            $row.='<a class="name-product m-1" href="'.BASEURL.'/home/infoProduct/'.$val->id.'">';
            $row.=$val->name;
            $row.='</a><p class="price-product m-1">';
            $row.=$val->price;
            $row.='</p></div></div>';
            $data[] = $row;
        }

        echo json_encode($data);
    }
    public function infoProduct($id){
        $productModel = $this->model('productModel');
        $Product = $productModel->getOne($id);
        
        
        echo json_encode($Product);
    }
}
