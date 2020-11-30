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
        return $userModel->getAll();
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
    public function info_warehouse()
    {
        if ($this->getSession('Admin')) {
            $this->view("admin/warehouse", "info");
        } else {
            $this->redirect('admin/login');
        }
    }
    public function insert_warehouse()
    {
        if ($this->getSession('Admin')) {
            $this->view("admin/warehouse", "insert");
        } else {
            $this->redirect('admin/login');
        }
    }
    public function getAllWarehouse()
    {
        $warehouseModel = $this->model('warehouseModel');
        return $warehouseModel->getAll();
    }
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
    public function activeWarehouse()
    {
        $response = array();
        $userModel = $this->model('warehouseModel');
        $response['status'] = false;
        if ($userModel->activeWarehouse($this->input('id'))) {
            $response['status'] = true;
        }
        echo json_encode($response);
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
    public function insert_product()
    {
        if ($this->getSession('Admin')) {
            $this->view("admin/product", "insert");
        } else {
            $this->redirect('admin/login');
        }
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
    public function insert_type_product()
    {
        if ($this->getSession('Admin')) {
            $this->view("admin/product/type", "insert");
        } else {
            $this->redirect('admin/login');
        }
    }
    // discount
    public function info_discount()
    {
        if ($this->getSession('Admin')) {
            $this->view("admin/discount", "info");
        } else {
            $this->redirect('admin/login');
        }
    }
    public function insert_discount()
    {
        if ($this->getSession('Admin')) {
            $this->view("admin/discount", "insert");
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
