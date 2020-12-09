<?php


class productModel
{
    private $db;

    public function __construct()
    {
        $this->db = new database;
    }
    /**
     * 
     * get all type product
     * 
     * id, name, brand, color, price, img, short_dis, dis, type_id, 
     * type_name, quantity, status, date_created, date_modify
     */
    public function getAll()
    {
        $this->db->Query("select mp.id, mp.name, mp.brand, mp.color, mp.price, mp.img, mp.short_discription, mp.discription,
        tp.id type_id, tp.name type_name, sum(wd.quantity) quantity, mp.status, mp.date_created, mp.date_modify
        FROM ((mp_product mp join mp_type_product tp on mp.id_type=tp.id) left join mp_warehouse_detail wd 
        on mp.id = wd.id_product) left join (select id from mp_warehouse where status ='ACTIVE') w 
        on w.id=wd.id_warehouse group by wd.id_product, mp.id");
        return $this->db->fetchAll();
    }
    /**
     * 
     * 
     * get info product to display
     */
    public function getOne($id)
    {
        $this->db->Query("select mp.id, mp.name, mp.brand, mp.color, mp.price, mp.img, mp.short_discription, mp.discription,
        tp.id type_id, tp.name type_name, sum(wd.quantity) quantity, mp.status, mp.date_created, mp.date_modify
        FROM ((mp_product mp join mp_type_product tp on mp.id_type=tp.id) left join mp_warehouse_detail wd 
        on mp.id = wd.id_product) left join (select id from mp_warehouse where status ='ACTIVE') w 
        on w.id=wd.id_warehouse group by wd.id_product, mp.id having mp.id=?",array($id));
        return $this->db->fetch();
    }
    /**
     * 
     * get products by id_type
     */
    public function getByType($id)
    {
        $this->db->Query("select mp.id, mp.name, mp.brand, mp.color, mp.price, mp.img, mp.short_discription, mp.discription,
        tp.id type_id, tp.name type_name, sum(wd.quantity) quantity, mp.status, mp.date_created, mp.date_modify
        FROM ((mp_product mp join mp_type_product tp on mp.id_type=tp.id) left join mp_warehouse_detail wd 
        on mp.id = wd.id_product) left join (select id from mp_warehouse where status ='ACTIVE') w 
        on w.id=wd.id_warehouse where tp.id=? group by wd.id_product, mp.id",array($id));
        return $this->db->fetchAll();
    }
    /**
     * 
     * active product
     */
    public function activeProduct($id)
    {
        $this->db->Query("update mp_product set status='ACTIVE' where id=?", array($id));
        return $this->db->rowCount();
    }
    /**
     * 
     * disable product
     */
    public function disableProduct($id)
    {
        $this->db->Query("update mp_product set status='DISABLE' where id=?", array($id));
        return $this->db->rowCount();
    }
    /**
     * 
     * get one product by id
     */
    public function get($id){
        $this->db->Query("select * from mp_product where id=?", array($id));
        return $this->db->fetch();
    }
    public function getWarehouse($id){
        $this->db->Query('select wd.id_warehouse, wd.quantity from mp_warehouse_detail wd join mp_warehouse w 
        on wd.id_warehouse = w.id where wd.id_product=? and w.status="ACTIVE"', array($id));
        return $this->db->fetchAll();
    }
    /**
     * 
     * save type product
     */
    public function save($data_p){
        $this->db->Query("update mp_product set name=?, brand=?, color=?, price=?,
            img=?, short_discription=?, discription=?, id_type=? where id=?", $data_p);
        return $this->db->rowCount();
    }
    public function updateWarehouseDetail($data){
        $this->db->Query("update mp_warehouse_detail set quantity=? where id_product=? and id_warehouse=?", $data);
        return $this->db->rowCount();
    }
    public function insertWarehouseDetail($data){
        $this->db->Query("insert into mp_warehouse_detail(quantity,id_product,id_warehouse) values(?,?,?)", $data);
        return $this->db->rowCount();
    }
    public function deleteWarehouseDetail($data){
        $this->db->Query("delete from mp_warehouse_detail where id_product=? and id_warehouse=?", $data);
        return $this->db->rowCount();
    }
    /**
     * 
     * insert type product
     */
    public function insert($data){
        $this->db->Query("insert into mp_product(name,brand,color,price,img,short_discription,discription,id_type) 
                values(?,?,?,?,?,?,?,?)", $data);
        if($this->db->rowCount()){
            $this->db->Query("select id from mp_product ORDER by id DESC");
            return $this->db->fetch()->id;
        }
        return false;
    }
    /**
     * 
     * add cart detail
     */
    public function addCart($acc, $id_p, $quan){
        $this->db->Query("select c.id from mp_cart c join mp_user u on c.id_user = u.id 
                where u.account=?", array($acc));
        $u = $this->db->fetch();
        
        $this->db->Query("insert into mp_cart_detail(id_cart,id_product,quantity) values(?,?,?)", 
                array($u->id,$id_p,$quan));
        $ck = false;
        if(!$this->db->rowCount()){
            $this->db->Query("update mp_cart_detail set quantity=quantity+? where id_cart=? and id_product=?", 
                array($quan,$u->id,$id_p));
            $ck = true;
        } else {
            $ck = true;
        }
        return $ck;
    }
}
