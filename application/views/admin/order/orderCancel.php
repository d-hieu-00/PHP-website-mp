<?php include "../application/views/admin/_assets/header.php" ?>
<!-- Topbar -->
<div class="container-fluid bg-white mb-4 text-center shadow">
    <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4">
        <!-- Sidebar Toggle (Topbar) -->
        <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
            <i class="fa fa-bars"></i>
        </button>
        <!-- Topbar info -->
        <div class="sidebar-heading">
            Thông tin đơn đặt hàng bị hủy
        </div>
    </nav>
</div>
<!-- Begin Page Content -->
<div class="container-fluid mt-4">

<div class="card shadow mb-4">
        <div class="card-header">
            <div class="row">
                <h6 class="col-md-6 d-flex align-items-center font-weight-bold text-primary">Tất cả đơn hàng bị hủy</h6>
                <!-- Table Search -->
                <div class="col-md-6 d-flex justify-content-end form-inline find-input">
                    <input type="text" class="form-control find" 
                    placeholder="Tìm kiếm theo cột..." tb_id="order_cancel_table">

                    <select class="form-control ml-2">
                        <option selected value="6">Tên tài khoản</option>
                        <option value="1">Tên khách hàng</option>
                        <option value="2">Số điện thoại</option>
                        <option value="4">Tổng tiền</option>
                        <option value="7">Địa chỉ</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="card-body">

            <table id="order_cancel_table" class="display w-100">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên khách hàng</th>
                        <th>Số điện thoại</th>
                        <th>Phí vận chuyển</th>
                        <th>Tổng tiền</th>
                        <th>Chi tiết hóa đơn</th>
                        <th>Tên tài khoản</th>
                        <th>Địa chỉ: </th>
                        <th>Ngày đặt hàng: </th>
                        <th>Ngày cập nhật đơn hàng: </th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>

</div>
<!-- /.container-fluid -->

<?php include "../application/views/admin/_assets/footer.php" ?>

<script>
    $(document).ready(function() {
        loadPage("#orderPage")
        initTable("#order_cancel_table", "/admin/getAllOrderCancel")
    })
</script>