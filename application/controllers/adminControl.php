<?php


class adminControl extends BaseController
{

    public function index()
    {
        if ($this->getSession('Admin')) {
            $this->view("admin", "index");
        } else {
            $this->redirect('admin/login');
        }
    }
    public function login()
    {
        if (isset($_POST['Password'])) {
            if (PASSWORDADMIN == $this->input('Password')) {
                $this->setSession('Admin', true);
                $this->redirect('admin');
            } else {
                $this->view("admin", "login", array('msg' => 'Sai mật khẩu'));
            }
        } else if ($this->getSession('Admin')) {
            $this->redirect('admin');
        } else {
            $this->view("admin", "login");
        }
    }
    public function logout()
    {
        $this->unsetSession('Admin');
        $this->redirect('admin');
    }
    // user
    public function info_user()
    {
        if ($this->getSession('Admin')) {
            $this->view("admin/user", "info");
        } else {
            $this->redirect('admin/login');
        }
    }
    public function getAllUser()
    {
        $userModel = $this->model('userModel');
        $allUser = $userModel->getAll();
        $i = 1;
        $data = [];
        foreach ($allUser as $val) {
            $row = [];
            $row[] = '<sapn>' . $i++ . '</span>';
            $row[] = '<sapn>' . $val->account . '</span>';
            $row[] = '<sapn>' . $val->fullName . '</span>';
            $row[] = '<sapn>' . $val->email . '</span>';
            $row[] = '<sapn>' . $val->phone . '</span>';
            $row[] = '<sapn>' . $val->city . '</span>';
            if ($val->status == "ACTIVE") {
                $row[] = '<button class="btn status btn-success" account="' . $val->account . '">'
                    . $val->status . '</button>';
            } else {
                $row[] = '<button class="btn status btn-danger" account="' . $val->account . '">'
                    . $val->status . '</button>';
            }
            $row[] = '<sapn>' . $val->province . '</span>';
            $row[] = '<sapn>' . $val->address . '</span>';
            $row[] = '<sapn>' . $val->userCreatedDate . '</span>';
            $row[] = '<sapn>' . $val->userLastAccessDate . '</span>';
            $data[] = $row;
        }

        echo json_encode(['data' => $data]);
    }
    public function disableUser()
    {
        $response = array();
        $userModel = $this->model('userModel');
        $userModel->setData(
            $this->input('Account'),
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        );
        $response['status'] = false;
        if ($userModel->deleteAccount()) {
            $response['status'] = true;
        }
        echo json_encode($response);
    }
    public function activeUser()
    {
        $response = array();
        $userModel = $this->model('userModel');
        $userModel->setData(
            $this->input('Account'),
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        );
        $response['status'] = false;
        if ($userModel->activeAccount()) {
            $response['status'] = true;
        }
        echo json_encode($response);
    }
    // warehouse
    /**
     * 
     * redrict info warehouse
     */
    public function info_warehouse()
    {
        if ($this->getSession('Admin')) {
            $this->view("admin/warehouse", "info");
        } else {
            $this->redirect('admin/login');
        }
    }
    /**
     * 
     * redrict insert warehouse
     */
    public function insert_warehouse()
    {
        if ($this->getSession('Admin')) {
            $this->view("admin/warehouse", "insert");
        } else {
            $this->redirect('admin/login');
        }
    }
    /**
     * 
     * return all warehouse type obj
     */
    public function getAllWarehouse()
    {
        $warehouseModel = $this->model('warehouseModel');
        $allWarehouse = $warehouseModel->getAll();
        $i = 1;
        $data = [];
        foreach ($allWarehouse as $val) {
            $row = [];
            $row[] = $i++;
            $row[] = '<span class="w-name" id_w="' . $val->id . '">' . $val->name . '</span>';
            $row[] = '<span class="w-city" id_w="' . $val->id . '">' . $val->city . '</span>';
            $row[] = '<span class="w-province" id_w="' . $val->id . '">' . $val->province . '</span>';
            $row[] = '<span class="w-address" id_w="' . $val->id . '">' . $val->address . '</span>';
            if ($val->status == "ACTIVE") {
                $row[] = '<button class="btn status btn-success" id_w="' . $val->id . '">'
                    . $val->status . '</button>';
                $row[] = '<button class="btn modify btn-info" id_w="' . $val->id . '"
                    data-toggle="modal" data-target="#modify-warehouse">Sửa</button>';
                $row[] = '<button class="btn detail btn-info" id_w="' . $val->id . '"
                    data-toggle="modal" data-target="#detail-warehouse">Chi tiết</button>';
            } else {
                $row[] = '<button class="btn status btn-danger" id_w="' . $val->id . '">'
                    . $val->status . '</button>';
                $row[] = '<button class="btn modify btn-info" id_w="' . $val->id . '"
                    data-toggle="modal" data-target="#modify-warehouse" disabled>Sửa</button>';
                $row[] = '<button class="btn detail btn-info" id_w="' . $val->id . '"
                    data-toggle="modal" data-target="#detail-warehouse" disabled>Chi tiết</button>';
            }
            $row[] = $val->date_created;
            $data[] = $row;
        }

        echo json_encode(['data' => $data]);
    }
    /**
     * 
     * disable warehouse
     */
    public function disableWarehouse()
    {
        $response = array();
        $warehouseModel = $this->model('warehouseModel');
        $response['status'] = false;
        if ($warehouseModel->disableWarehouse($this->input('id'))) {
            $response['status'] = true;
        }
        echo json_encode($response);
    }
    /**
     * 
     * active warehouse
     */
    public function activeWarehouse()
    {
        $response = array();
        $warehouseModel = $this->model('warehouseModel');
        $response['status'] = false;
        if ($warehouseModel->activeWarehouse($this->input('id'))) {
            $response['status'] = true;
        }
        echo json_encode($response);
    }
    /**
     * 
     * save warehouse
     */
    public function saveWarehouse()
    {
        $response = array();
        $data = [
            $this->input('name'),
            $this->input('city'),
            $this->input('province'),
            $this->input('address'),
            $this->input('id')
        ];
        $warehouseModel = $this->model('warehouseModel');
        $response['status'] = false;
        if ($warehouseModel->save($data)) {
            $response['status'] = true;
        }
        echo json_encode($response);
    }
    /**
     * 
     * 
     * insert warehouse
     */
    public function insertWarehouse()
    {
        $response = array();
        $data = [
            $this->input('name'),
            $this->input('city'),
            $this->input('province'),
            $this->input('address'),
            $this->input('status')
        ];
        $warehouseModel = $this->model('warehouseModel');
        $response['status'] = false;
        if ($warehouseModel->insert($data)) {
            $response['status'] = true;
        } else if ($warehouseModel->checkName($data[0]) > 0) {
            $response['NameError'] = 'Kho đã tồn tại';
        } else {
            $response['msg'] = 'Lỗi không xác định!!';
        }
        echo json_encode($response);
    }
    /**
     * 
     * 
     * details warehouse
     */
    public function detailsWarehouse($id)
    {
        $warehouseModel = $this->model('warehouseModel');
        $allWarehouse = $warehouseModel->details($id);
        $i = 1;
        $data = [];
        foreach ($allWarehouse as $val) {
            $row = [];
            $row[] = $i++;
            $row[] = '<span>' . $val->name . '</span>';
            $row[] = '<span>' . $val->brand . '</span>';
            $row[] = '<span>' . $val->quantity . '</span>';
            $row[] = $val->date_modify;
            $data[] = $row;
        }

        echo json_encode(['data' => $data]);
    }
    //type product
    public function info_type_product()
    {
        if ($this->getSession('Admin')) {
            $this->view("admin/product/type", "info");
        } else {
            $this->redirect('admin/login');
        }
    }

    /**
     * 
     * return all type-product type obj
     */
    public function getAllTypeProduct()
    {
        $typeProductModel = $this->model('typeProductModel');
        $allTP = $typeProductModel->getAll();
        $i = 1;
        $data = [];
        foreach ($allTP as $val) {
            $row = [];
            $row[] = $i++;
            $row[] = '<span class="tp-name" id_tp="' . $val->id . '">' . $val->name . '</span>';
            $row[] = '<span class="tp-quantity" id_tp="' . $val->id . '">' . $val->quantity . '</span>';
            $row[] = '<span class="tp-category" id_tp="'
                . $val->id . '" id_category="' . $val->id_category . '">'
                . $val->name_category . '</span>';
            if ($val->status == "ACTIVE") {
                $row[] = '<button class="btn status btn-success" id_tp="' . $val->id . '">'
                    . $val->status . '</button>';
                $row[] = '<button class="btn modify btn-info" id_tp="' . $val->id . '"
                    data-toggle="modal" data-target="#modify-type-product">Sửa</button>';
            } else {
                $row[] = '<button class="btn status btn-danger" id_tp="' . $val->id . '">'
                    . $val->status . '</button>';
                $row[] = '<button class="btn modify btn-info" id_tp="' . $val->id . '"
                    data-toggle="modal" data-target="#modify-type-product" disabled>Sửa</button>';
            }
            $row[] = $val->date_created;
            $data[] = $row;
        }

        echo json_encode(['data' => $data]);
    }
    /**
     * 
     * disable type product
     */
    public function disableTypeProduct()
    {
        $response = array();
        $typeProductModel = $this->model('typeProductModel');
        $response['status'] = false;
        if ($typeProductModel->disableTypeProduct($this->input('id'))) {
            $response['status'] = true;
        }
        echo json_encode($response);
    }
    /**
     * 
     * active warehouse
     */
    public function activeTypeProduct()
    {
        $response = array();
        $typeProductModel = $this->model('typeProductModel');
        $response['status'] = false;
        if ($typeProductModel->activeTypeProduct($this->input('id'))) {
            $response['status'] = true;
        }
        echo json_encode($response);
    }
    /**
     * 
     * save warehouse
     */
    public function saveTypeProduct()
    {
        $response = array();
        $data = [
            $this->input('id_category'),
            $this->input('name'),
            $this->input('id')
        ];
        $typeProductModel = $this->model('typeProductModel');
        $response['status'] = false;
        if ($typeProductModel->save($data)) {
            $response['status'] = true;
        }
        echo json_encode($response);
    }
    /**
     * 
     * 
     * insert warehouse
     */
    public function insertTypeProduct()
    {
        $response = array();
        $data = [
            $this->input('name'),
            $this->input('id_category'),
            $this->input('status')
        ];
        $typeProductModel = $this->model('typeProductModel');
        $response['status'] = false;
        if ($typeProductModel->insert($data)) {
            $response['status'] = true;
        } else if ($typeProductModel->checkName($data[0]) > 0) {
            $response['NameError'] = 'Loại sản phẩm đã tồn tại';
        } else {
            $response['msg'] = 'Lỗi không xác định!!';
        }
        echo json_encode($response);
    }
    public function insert_type_product()
    {
        if ($this->getSession('Admin')) {
            $this->view("admin/product/type", "insert");
        } else {
            $this->redirect('admin/login');
        }
    }
    // product
    public function info_product()
    {
        if ($this->getSession('Admin')) {
            $this->view("admin/product", "info");
        } else {
            $this->redirect('admin/login');
        }
    }
    /**
     * 
     * get all product
     */
    public function getAllProduct()
    {
        $productModel = $this->model('productModel');
        $allProduct = $productModel->getAll();
        $i = 1;
        $data = [];
        foreach ($allProduct as $val) {
            if ($val->quantity == null) $val->quantity = 0;
            $row = [];
            $row[] = $i++;
            $row[] = '<span class="p-name" id_p="' . $val->id . '">' . $val->name . '</span>';
            $row[] = '<span class="p-type-name" id_p="'
                . $val->id . '" type_id="' . $val->type_id . '">'
                . $val->type_name . '</span>';
            $row[] = '<span class="p-brand" id_p="' . $val->id . '">' . $val->brand . '</span>';
            if ($val->color == null) {
                $row[] = '<span class="p-color">none</span>';
            } else {
                $row[] = '<input disabled type="color" class="form-control p-color" 
                    id_p ="' . $val->id . '"value="' . $val->color . '">';
            }
            $row[] = '<span class="p-price" id_p="' . $val->id . '">' . $val->price . '</span>';
            $row[] = '<span class="p-quantity" id_p="' . $val->id . '">' . $val->quantity . '</span>';
            if ($val->status == "ACTIVE") {
                $row[] = '<button class="btn status btn-success" id_p="' . $val->id . '">'
                    . $val->status . '</button>';
                $row[] = '<button class="btn modify btn-info" id_p="' . $val->id . '"
                    data-toggle="modal" data-target="#modify-product">Sửa</button>';
            } else {
                $row[] = '<button class="btn status btn-danger" id_p="' . $val->id . '">'
                    . $val->status . '</button>';
                $row[] = '<button class="btn modify btn-info" id_p="' . $val->id . '"
                    data-toggle="modal" data-target="#modify-product" disabled>Sửa</button>';
            }
            $row[] = '<span class="p-short-discription" id_p="' . $val->id . '">' . $val->short_discription . '</span>';
            $row[] = '<span class="p-discription" id_p="' . $val->id . '">' . $val->discription . '</span>';
            if ($val->img != null) {
                $row[] = '<img id="img" width="100px" src = "' . $val->img . '"id_p="' . $val->id . '">';
            } else {
                $row[] = '<img id="img" width="100px" src="../public/assets/img/product.png" id_p="' . $val->id . '">';
            }
            $row[] = $val->date_created;
            $data[] = $row;
        }

        echo json_encode(['data' => $data]);
    }
    /**
     * 
     * disable product
     */
    public function disableProduct()
    {
        $response = array();
        $productModel = $this->model('productModel');
        $response['status'] = false;
        if ($productModel->disableProduct($this->input('id'))) {
            $response['status'] = true;
        }
        echo json_encode($response);
    }
    /**
     * 
     * active product
     */
    public function activeProduct()
    {
        $response = array();
        $productModel = $this->model('productModel');
        $response['status'] = false;
        if ($productModel->activeProduct($this->input('id'))) {
            $response['status'] = true;
        }
        echo json_encode($response);
    }
    /**
     * 
     * 
     * get type product for tag select
     */
    public function getTypeProductForTagSelect()
    {
        $response = array();
        $TypeProductModel = $this->model('TypeProductModel');
        $response['status'] = true;
        $allTP = $TypeProductModel->getAll();
        $data = array();
        foreach ($allTP as $val) {
            $row = array();
            $row[] = $val->id;
            $row[] = $val->name;
            $data[] = $row;
        }
        $response['data'] = $data;
        echo json_encode($response);
    }
    /**
     * 
     * 
     * get warehouse for tag select
     */
    public function getWarehouseForTagSelect()
    {
        $response = array();
        $warehouseModel = $this->model('warehouseModel');
        $response['status'] = true;
        $allWarehosue = $warehouseModel->getAll();
        $data = array();
        foreach ($allWarehosue as $val) {
            $row = array();
            $row[] = $val->id;
            $row[] = $val->name;
            $data[] = $row;
        }
        $response['data'] = $data;
        echo json_encode($response);
    }
    /**
     * 
     * 
     * get one product
     */
    public function getOneProduct()
    {
        $response = array();
        $productModel = $this->model('productModel');
        $response['status'] = true;
        $productModel = $productModel->get($this->input('id'));
        $response['data'] = $productModel;
        echo json_encode($response);
    }
    public function getWarehouseByIdProduct()
    {
        $response = array();
        $productModel = $this->model('productModel');
        $response['status'] = true;
        $productModel = $productModel->getWarehouse($this->input('id'));
        $response['data'] = $productModel;
        echo json_encode($response);
    }
    /**
     * 
     * save product
     */
    public function saveProduct()
    {
        $response = array();
        $data_p = [
            $this->input('name'),
            $this->input('brand'),
            $this->input('color'),
            $this->input('price'),
            $this->input('img'),
            $this->input('short_discription'),
            $this->input('discription'),
            $this->input('id_type'),
            $this->input('id')
        ];
        //quantity, id_pro, id_ware
        $id_pro = $this->input('id');
        $data_w = $this->input('warehouse');
        $productModel = $this->model('productModel');
        $response['status'] = false;
        if ($productModel->save($data_p)) {
            $productModel->deleteAllWarehouseDetails($id_pro);
            foreach ($data_w as $val) {
                $productModel->insertWarehouseDetail($val);
            }
            $response['status'] = true;
        }
        echo json_encode($response);
    }
    /**
     * 
     * 
     * insert product
     */
    public function insertProduct()
    {
        $response = array();
        $data_p = [
            $this->input('name'),
            $this->input('brand'),
            $this->input('color'),
            $this->input('price'),
            $this->input('img'),
            $this->input('short_discription'),
            $this->input('discription'),
            $this->input('id_type')
        ];
        $data_w = $this->input('warehouse');
        $productModel = $this->model('productModel');
        $response['status'] = false;
        $id = $productModel->insert($data_p);
        if ($id) {
            foreach ($data_w as $val) {
                $data = [$val[0], $id, $val[1]];
                if ($productModel->updateWarehouseDetail($data) < 1) {
                    $productModel->insertWarehouseDetail($data);
                }
            }
            $response['status'] = true;
        }
        echo json_encode($response);
    }
    public function insert_product()
    {
        if ($this->getSession('Admin')) {
            $this->view("admin/product", "insert");
        } else {
            $this->redirect('admin/login');
        }
    }
    // order
    public function info_order()
    {
        if ($this->getSession('Admin')) {
            $this->view("admin/order", "info");
        } else {
            $this->redirect('admin/login');
        }
    }
    // invoice
    public function info_invoice()
    {
        if ($this->getSession('Admin')) {
            $this->view("admin/order/invoice", "info");
        } else {
            $this->redirect('admin/login');
        }
    }
}
