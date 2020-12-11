<?php

class productControl extends BaseController
{

    /**
     * 
     * get all product
     */
    public function getAllProduct(){
        $productModel = $this->model('productModel');
        $allProduct = $productModel->getAll();
        $data = [];
        foreach ($allProduct as $val) {
            $row = '<div class="col p-0"><div class="border m-1">';
            $row.='<div class="hovereffect">';
            $row.='<a href="'.BASEURL.'/product/infoProduct/'.$val->id.'">';
            $row.='<img id="img" class="img-fluid" src="'.$val->img.'">';
            $row.='</a></div>';
            $row.='<a class="name-product m-1" href="'.BASEURL.'/product/infoProduct/'.$val->id.'">';
            $row.=$val->name;
            $row.='</a><p class="price-product m-1">';
            $row.=$val->price;
            $row.=' ₫</p></div></div>';
            $data[] = $row;
        }

        echo json_encode($data);
    }
    public function infoProduct($id){
        $productModel = $this->model('productModel');
        $Product = $productModel->getOne($id);
        
        
        $this->view("product", "infoProduct", array($Product));
    }
    public function getByType($id){
        $productModel = $this->model('productModel');
        $ProductsByType = $productModel->getByType($id);
        $data = [];
        foreach ($ProductsByType as $val) {
            $row = '<div class="col p-0"><div class="border m-1">';
            $row.='<div class="hovereffect">';
            $row.='<a href="'.BASEURL.'/product/infoProduct/'.$val->id.'">';
            $row.='<img id="img" class="img-fluid" src="'.$val->img.'">';
            $row.='</a></div>';
            $row.='<a class="name-product m-1" href="'.BASEURL.'/product/infoProduct/'.$val->id.'">';
            $row.=$val->name;
            $row.='</a><p class="price-product m-1">';
            $row.=$val->price;
            $row.='</p></div></div>';
            $data[] = $row;
        }
        
        $this->view("product", "getByType", $data);
    }
    public function addCart(){
        $response = array();
        $productModel = $this->model('productModel');
        $acc = $this->input('account');
        $id_p = $this->input('id_p');
        $quan = $this->input('quan');

        $response['status'] = false;
        if($productModel->addCart($acc, $id_p, $quan)){
            $response['status'] = true;
        }

        echo json_encode($response);
    }
}
