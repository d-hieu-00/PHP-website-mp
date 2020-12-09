<?php

class cartControl extends BaseController
{

    public function info()
    {
        $this->view("cart", "info");
    }

    public function getInfoByIdProduct(){
        $product = $this->model('productModel');
        $res = $product->getOne($this->input('id_p'));

        echo json_encode($res);
    }
}
