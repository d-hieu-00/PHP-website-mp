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
            Thông tin các sản phẩm
        </div>
    </nav>
</div>
<!-- Begin Page Content -->
<div class="container-fluid mt-4">

    <div class="card shadow mb-4">
        <div class="card-header">
            <div class="row">
                <h6 class="col-md-6 d-flex align-items-center font-weight-bold text-primary">
                    Tất cả sản phẩm</h6>
                <!-- Table Search -->
                <div class="col-md-6 d-flex justify-content-end form-inline find-input">
                    <input type="text" class="form-control find" 
                    placeholder="Tìm kiếm theo cột..." tb_id="product_table">

                    <select class="form-control ml-2">
                        <option selected value="1">Tên loại sản phẩm</option>
                        <option value="2">Số lượng sản phẩm</option>
                        <option value="3">Danh mục</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="card-body">

            <table id="product_table" class="display w-100">
                <thead>
                    <tr>
                    <!-- id, name, brand, color, price, img, short_dis, dis, type_name, quantity, date_created, date_modify -->
                        <th>STT</th>
                        <th>Tên sản phẩm</th>
                        <th>Loại sản phẩm</th>
                        <th>Thương hiệu</th>
                        <th>Màu</th>
                        <th>Giá bán</th>
                        <th>Số lượng</th>
                        <th>Trạng thái</th>
                        <th>Sửa</th>
                        <th>Chi tiết</th>
                        <th>Mô tả ngắn</th>
                        <th>Mô tả chi tiết</th>
                        <th>Hình</th>
                        <th>Ngày tạo</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
</div>
<!-- /.container-fluid -->

<!-- Modal modify product -->
<div class="modal fade" id="modify-product" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Sửa thông tin sản phẩm</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="Name">
                        <i class="fas fa-file-signature"></i>
                        <strong>Tên sản phẩm</strong>
                    </label>
                    <input type="text" id="Name" name="Name" class="form-control Name" 
                        placeholder="Tên sản phẩm" required>
                </div>

                <div class="form-group">
                    <label for="city">
                        <i class="fas fa-city"></i>
                        <strong>Thương hiệu</strong>
                    </label>
                    <input type="text" id="City" name="City" class="form-control City" 
                        placeholder="Tỉnh/ thành phố" required>
                </div>

                <div class="form-group">
                    <label for="Color">
                        <i class="fas fa-map-marked-alt"></i>
                        <strong>Huyện</strong>
                    </label>
                    <input type="text" id="Province" name="Province" class="form-control Province" 
                        placeholder="Huyện" required>
                    <input type="color" class="form-control Color" value="#000000">
                </div>

                <div class="form-group">
                    <label for="Address">
                        <i class="fas fa-info-circle"></i>
                        <strong>Địa chỉ chi tiết</strong>
                    </label>
                    <input type="text" id="Address" name="Address" class="form-control Address" placeholder="Địa chỉ chi tiết" required>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Thoát</button>
                <button id="w-save" type="button" class="btn btn-success">Lưu thông tin</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal detail warehouse -->
<div class="modal fade" id="detail-warehouse" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Thông tin chi tiết kho</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Thoát</button>
            </div>
        </div>
    </div>
</div>
<?php include "../application/views/admin/_assets/footer.php" ?>
<script>
    $(document).ready(function() {
        loadPage("#productPage")
        initTable("#product_table", "/admin/getAllProduct")
    })
</script>