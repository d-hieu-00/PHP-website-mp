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
        on mp.id = wd.id_product) join (select id from mp_warehouse where status ='ACTIVE') w 
        on w.id=wd.id_warehouse group by wd.id_product, mp.id");
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
     * save type product
     */
    public function save($data){
        $this->db->Query("update mp_type_product set id_category=?, name=? where id=?", $data);
        return $this->db->rowCount();
    }
    /**
     * 
     * insert type product
     */
    public function insert($data){
        $this->db->Query("insert into mp_type_product(name,id_category,status) 
                values(?,?,?)", $data);
        return $this->db->rowCount();
    }
    /**
     * 
     * check name unique
     */
    public function checkName($name){
        $this->db->Query("select * from mp_type_product where name=?", array($name));
        return $this->db->rowCount();
    }
    /**
     * 
     * get all type product by id_category
     */
    public function getTypeProductByIdCategory($id_category)
    {
        $this->db->Query("select tp.id, tp.name
        from mp_type_product tp
        where tp.id_category = ?", array($id_category));
        return $this->db->fetchAll();
    }
}
