<html>

<head>
    <title>Home mate - Admin</title>
    <?php require_once "../application/views/admin/_assets/css.php"; ?>
</head>
<body>
<?php include "../application/views/admin/_assets/header.php" ?>
<!-- Topbar -->
<div class="container-fluid bg-white mb-4 text-center shadow">
<nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 shadow">
    <!-- Topbar Search -->
    <div class="input-group">
        <input type="text" class="form-control bg-light" placeholder="Tìm kiếm thông tin hóa đơn...">
         
        <select class="bg-light my-select">
            <option selected>ID</option>
            <option value="account">Account</option>
            <option value="fullName">Full Name</option>
            <option value="email">Email</option>
            <option value="city">City</option>
        </select>
        <!-- </div> -->
        <div class="input-group-append">
            <button class="btn btn-primary" type="button">
                <i class="fas fa-search fa-sm"></i>
            </button>
        </div>
    </div>
</nav>
</div>
<!-- Begin Page Content -->
<div class="container-fluid">









</div>
<!-- /.container-fluid -->
<?php include "../application/views/admin/_assets/footer.php" ?>
<script>
    $(document).ready(function(){
        a = $(".navbar-nav li.active")
        for(i=0; i<a.length; i++) a.eq(i).removeClass('active')
        $("#orderPage").addClass('active')
    })
</script>
</body>
</html>