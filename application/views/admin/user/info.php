<html>

<head>
    <title>Home mate - Admin</title>
    <?php require_once "../application/views/admin/_assets/css.php"; ?>
</head>
<body>
<?php include "../application/views/admin/_assets/header.php" ?>

<!-- Begin Page Content -->
<div class="container-fluid mt-4">

    <div class="card shadow mb-4">
    <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Tất cả khách hàng</h6>
    </div>
    <div class="card-body">

    <table id="user_table" class="display compact hover collapsed">
        <thead>
            <tr>
                <th>STT</th>
                <th>Tên tài khoản</th>
                <th>Họ và tên</th>
                <th>Địa chỉ email</th>
                <th>Số điện thoại</th>
                <th>Tỉnh/ thành phố</th>
                <th>Trạng thái</th>
                <th>Huyện</th>
                <th>Địa chỉ chi tiết: </th>
                <th>Ngày tạo tài khoản: </th>
                <th>Lần truy cập cuối: </th>
            </tr>
        </thead>
        <tbody>
            <?php
                function load($a){
                    $allUser = $a->getAlluser();
                    $i = 1;
                    foreach($allUser as $val){
                        echo '<tr>';
                        echo '<td>'.$i++.'</td>';
                        echo '<td>'.$val->account.'</td>';
                        echo '<td>'.$val->fullName.'</td>';
                        echo '<td>'.$val->email.'</td>';
                        echo '<td>'.$val->phone.'</td>';
                        echo '<td>'.$val->city.'</td>';
                        echo '<td><button class="btn status" account="'.$val->account.'">'.$val->status.'</button></td>';
                        echo '<td>'.$val->province.'</td>';
                        echo '<td>'.$val->address.'</td>';
                        echo '<td>'.$val->userCreatedDate.'</td>';
                        echo '<td>'.$val->userLastAccessDate.'</td>';
                        echo '</tr>';
                    }
                }
                load($this);
            ?>
        </tbody>
    </table>
    </div>
    </div>
</div>
<!-- /.container-fluid -->

<?php include "../application/views/admin/_assets/footer.php" ?>

<script>
    $(document).ready(function(){
        a = $(".navbar-nav li.active")
        for(i=0; i<a.length; i++) a.eq(i).removeClass('active')
        $("#userPage").addClass('active')

        a = $("#user_table button")
        for(i=0; i<a.length; i++) {
            if(a.eq(i).text()=="ACTIVE"){
                a.eq(i).addClass('btn-success');
            } else {
                a.eq(i).addClass('btn-danger');
            }
        }

        $('#user_table')
            .addClass( 'nowrap' )
            .dataTable( {
                responsive: true
            } );
    })
</script>

</body>
</html>