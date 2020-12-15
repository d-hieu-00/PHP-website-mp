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
                Home Page Admin
            </div>
        </nav>
    </div>
    <!-- Begin Page Content -->
    <div class="container-fluid">

    <div class="row">

<!-- Earnings (Monthly) Card Example -->
<div class="col-xl-3 col-md-6 mb-4">
    <div class="card border-left-primary shadow h-100 py-2">
        <div class="card-body">
            <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                        Doanh thu trong tháng</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">
                        <?php echo $data['earn-month']?>
                    </div>
                </div>
                <div class="col-auto">
                    <i class="fas fa-calendar fa-2x text-gray-300"></i>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Earnings (Monthly) Card Example -->
<div class="col-xl-3 col-md-6 mb-4">
    <div class="card border-left-success shadow h-100 py-2">
        <div class="card-body">
            <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                    <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                        Doanh thu trong năm</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">
                        <?php echo $data['earn-anual']?>
                    </div>
                </div>
                <div class="col-auto">
                    <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Earnings (Monthly) Card Example -->
<div class="col-xl-3 col-md-6 mb-4">
    <div class="card border-left-info shadow h-100 py-2">
        <div class="card-body">
            <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                    <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                        Số đơn hàng chờ xác nhận
                    </div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">
                        <?php echo $data['pending']?>
                    </div>
                </div>
                <div class="col-auto">
                    <i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Pending Requests Card Example -->
<div class="col-xl-3 col-md-6 mb-4">
    <div class="card border-left-warning shadow h-100 py-2">
        <div class="card-body">
            <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                    <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                        Số đơn hàng đang giao</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">
                        <?php echo $data['shipping']?>
                    </div>
                </div>
                <div class="col-auto">
                    <i class="fas fa-shipping-fast fa-2x text-gray-300"></i>
                </div>
            </div>
        </div>
    </div>
</div>
</div>



    </div>
    <!-- /.container-fluid -->
<?php include "../application/views/admin/_assets/footer.php" ?>