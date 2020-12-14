
<?php




class orderModel{
    private $db;
    public function __construct(){
        $this->db = new database();
    }

    public function order($FullName, $Phone, $Address, $City, $Province, $Total, $Cd, $Account){
        $this->db->startTran();
        if($Account != ""){
            $this->db->Query('select id from mp_user where account=?',array($Account));
            $id_user = $this->db->fetch();
            $this->db->Query('insert into mp_order(id_user,shipping_fee,total_price,full_name,phone,address,city,province)
                values(?,"20000",?,?,?,?,?,?)', array($id_user->id,$Total,$FullName,$Phone,$Address,$City,$Province));
        } else {
            $this->db->Query('insert into mp_order(shipping_fee,total_price,full_name,phone,address,city,province)
                values("20000",?,?,?,?,?,?)', array($Total,$FullName,$Phone,$Address,$City,$Province));
        }
        
        if($this->db->rowCount() > 0){
            $this->db->Query('select id from mp_order order by id DESC');
            $id_order = $this->db->fetch();
            for($i=0; $i<Count($Cd); $i++){
                $this->db->Query('insert into mp_order_detail(id_order,id_product,quantity,price) values(?,?,?,?)',
                    array($id_order->id,$Cd[$i]['id'],$Cd[$i]['quan'],$Cd[$i]['price']));
                if($this->db->rowCount() <= 0){
                    $this->db->rollback();
                    return false;
                }
            }
            $this->db->commit();
            return true;
        } else {
            $this->db->rollback();
            return false;
        }
        $this->db->commit();
    }
}