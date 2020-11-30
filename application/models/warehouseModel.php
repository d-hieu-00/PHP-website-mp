<?php


class warehouseModel
{
    private $db;

    public function __construct()
    {
        $this->db = new database;
    }

    public function getAll()
    {
        $this->db->Query("select * from mp_warehouse");
        return $this->db->fetchAll();
    }
    public function activeWarehouse($id)
    {
        $this->db->Query("update mp_warehouse set status='ACTIVE' where id=?", array($id));
        return $this->db->rowCount();
    }
    public function disableWarehouse($id)
    {
        $this->db->Query("update mp_warehouse set status='DISABLE' where id=?", array($id));
        return $this->db->rowCount();
    }
}
