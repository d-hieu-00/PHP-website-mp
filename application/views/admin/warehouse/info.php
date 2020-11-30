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
                <h6 class="m-0 font-weight-bold text-primary">Thông tin kho</h6>
            </div>
            <div class="card-body">

                <table id="warehouse_table" class="display compact hover collapsed">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên kho</th>
                            <th>Tỉnh/ thành phố</th>
                            <th>Huyện</th>
                            <th>Địa chỉ chi tiết</th>
                            <th>Trạng thái</th>
                            <th>Action</th>
                            <th>Ngày tạo kho</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        function load($a)
                        {
                            $allWarehouse = $a->getAllWarehouse();
                            $i = 1;
                            foreach ($allWarehouse as $val) {
                                echo '<tr>';
                                echo '<td>' . $i++ . '</td>';
                                echo '<td>' . $val->name . '</td>';
                                echo '<td>' . $val->city . '</td>';
                                echo '<td>' . $val->province . '</td>';
                                echo '<td>' . $val->address . '</td>';
                                echo '<td><button class="btn status" id_w="' . $val->id . '">' . $val->status . '</button></td>';
                                echo '<td><button class="btn modify" id_w="' . $val->id . '"
                        data-toggle="modal" data-target="#modify-warehouse">Sửa thông tin kho</button></td>';
                                echo '<td>' . $val->date_created . '</td>';
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

    <!-- Modal -->
    <div class="modal fade" id="modify-warehouse" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Sửa thông tin kho</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="Password">
                            <i class="fa fa-key" aria-hidden="true"></i>
                            <strong>Mật khẩu</strong>
                        </label>
                        <input type="password" id="Password" name="Password" class="form-control Password" placeholder="Nhập mật khẩu" required>
                    </div>

                    <div class="form-group">
                        <label for="Password">
                            <i class="fa fa-key" aria-hidden="true"></i>
                            <strong>Mật khẩu</strong>
                        </label>
                        <input type="password" id="Password" name="Password" class="form-control Password" placeholder="Nhập mật khẩu" required>
                    </div>

                    <div class="form-group">
                        <label for="Password">
                            <i class="fa fa-key" aria-hidden="true"></i>
                            <strong>Mật khẩu</strong>
                        </label>
                        <input type="password" id="Password" name="Password" class="form-control Password" placeholder="Nhập mật khẩu" required>
                    </div>

                    <div class="form-group">
                        <label for="Password">
                            <i class="fa fa-key" aria-hidden="true"></i>
                            <strong>Mật khẩu</strong>
                        </label>
                        <input type="password" id="Password" name="Password" class="form-control Password" placeholder="Nhập mật khẩu" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Thoát</button>
                    <button id="xtk" type="button" class="btn btn-primary">Lưu thông tin</button>
                </div>
            </div>
        </div>
    </div>
    <?php include "../application/views/admin/_assets/footer.php" ?>
    <script>
        $(document).ready(function() {
            a = $(".navbar-nav li.active")
            for (i = 0; i < a.length; i++) a.eq(i).removeClass('active')
            $("#warehousePage").addClass('active')

            a = $("#warehouse_table button")
            for (i = 0; i < a.length; i++) {
                if (a.eq(i).text() == "ACTIVE") {
                    a.eq(i).addClass('btn-success');
                } else if (a.eq(i).text() == "DISABLE") {
                    a.eq(i).addClass('btn-danger')
                    a.eq(i).parents('tr').find('button.modify').attr('disabled', 'true')
                } else {
                    a.eq(i).addClass('btn-info');
                }
            }

            $('#warehouse_table')
                .addClass('nowrap')
                .dataTable({
                    responsive: true
                });
        })
    </script>
</body>

</html>